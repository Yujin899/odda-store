import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const GET = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    
    const order = await Order.findById(id)
      .populate('userId', 'name email')
      .populate('items.productId');

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const sanitizedOrder = {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: order.shippingAddress?.fullName || 'N/A',
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentScreenshot: order.paymentProof || null,
      status: order.status,
      userId: (order as any).userId?._id?.toString() ?? (order as any).userId?.toString() ?? null,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
    };

    return NextResponse.json(sanitizedOrder);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;

export const PATCH = auth(async (req, { params }) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ['pending_payment', 'pending_verification', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    
    // 1. FETCH ORDER: We need previous status and items for stock restoration
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    const oldStatus = order.status;

    // 2. STOCK RESTORATION: If status changes to 'cancelled', restore stock
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      try {
        const productItems = order.items.filter((item: any) => item.type === 'Product' || !item.type);
        const bundleItems = order.items.filter((item: any) => item.type === 'Bundle');

        if (productItems.length > 0) {
          const productOps = productItems.map((item: any) => ({
            updateOne: {
              filter: { _id: item.productId },
              update: { $inc: { stock: item.quantity } }
            }
          }));
          await Product.bulkWrite(productOps);
        }

        if (bundleItems.length > 0) {
          const bundleOps = bundleItems.map((item: any) => ({
            updateOne: {
              filter: { _id: item.productId },
              update: { $inc: { stock: item.quantity } }
            }
          }));
          const { Bundle } = await import('@/models/Bundle');
          await Bundle.bulkWrite(bundleOps);
        }
      } catch (stockRestoreErr) {
        console.error('Stock restoration error:', stockRestoreErr);
      }
    }

    // 3. UPDATE STATUS
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    // --- ASYNC ACTIONS: STATUS UPDATE EMAIL ---
    // Rule: Only send for 'shipped' status to save quota. 'delivered' is removed.
    if (status === 'shipped' && updatedOrder.shippingAddress?.email) {
      try {
        const { StoreSettings } = await import('@/models/StoreSettings');
        const settings = await StoreSettings.findOne();
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        // Determine locale
        const localeString = updatedOrder.locale || settings?.defaultLanguage || 'en';
        const isAr = localeString === 'ar';
        const { getPremiumEmailHtml } = await import('@/lib/email-templates');

        // Get subject and body from settings with placeholders and minimal fallbacks
        const subject = isAr
          ? (settings?.shippedSubjectAr?.replace(/{{orderNumber}}/g, updatedOrder.orderNumber) || `عُدّة - تم شحن طلبك #${updatedOrder.orderNumber}`)
          : (settings?.shippedSubjectEn?.replace(/{{orderNumber}}/g, updatedOrder.orderNumber) || `Odda - Order #${updatedOrder.orderNumber} Shipped`);

        const bodyText = isAr
          ? (settings?.shippedBodyAr
              ?.replace(/{{customerName}}/g, updatedOrder.shippingAddress.fullName)
              ?.replace(/{{orderNumber}}/g, updatedOrder.orderNumber)
            || `عظيم! تم شحن طلبك رقم ${updatedOrder.orderNumber} وهو في طريقه إليك.`)
          : (settings?.shippedBodyEn
              ?.replace(/{{customerName}}/g, updatedOrder.shippingAddress.fullName)
              ?.replace(/{{orderNumber}}/g, updatedOrder.orderNumber)
            || `Good news! Your order #${updatedOrder.orderNumber} has been shipped.`);

        const htmlContent = getPremiumEmailHtml({
          subject,
          bodyText,
          customerName: updatedOrder.shippingAddress.fullName,
          orderNumber: updatedOrder.orderNumber,
          items: updatedOrder.items.map((item: any) => ({
            name: item.name,
            nameAr: item.nameAr,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: updatedOrder.totalAmount,
          isAr,
          baseUrl,
        });

        await resend.emails.send({
          from: 'Odda Store <onboarding@resend.dev>',
          to: updatedOrder.shippingAddress.email,
          subject: subject,
          html: htmlContent,
        });
      } catch (emailErr) {
        console.error('Status update email error:', emailErr);
      }
    }

    const sanitizedOrder = {
      id: updatedOrder._id.toString(),
      orderNumber: updatedOrder.orderNumber,
      customer: updatedOrder.shippingAddress?.fullName || 'N/A',
      items: updatedOrder.items,
      totalAmount: updatedOrder.totalAmount,
      paymentMethod: updatedOrder.paymentMethod,
      paymentScreenshot: updatedOrder.paymentProof || null,
      status: updatedOrder.status,
      userId: updatedOrder.userId?._id?.toString() ?? updatedOrder.userId?.toString() ?? null,
      createdAt: updatedOrder.createdAt,
    };

    return NextResponse.json(sanitizedOrder);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;
