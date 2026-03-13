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

    return NextResponse.json(order);
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
        const locale = updatedOrder.locale || 'en';
        
        let subject = '';
        let htmlContent = '';

        const fallbackHtmlEn = `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; text-transform: uppercase;">Order Shipped!</h1>
            <p>Hi ${updatedOrder.shippingAddress.fullName},</p>
            <p>Great news! Your order <strong>${updatedOrder.orderNumber}</strong> has been shipped and is on its way to you.</p>
            <a href="${baseUrl}/order-tracking?order=${updatedOrder.orderNumber}" 
               style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block; margin-top: 20px;">
               Track Your Order
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 40px;">Odda Store - Premium Dental Tools</p>
          </div>
        `;

        const fallbackHtmlAr = `
          <div style="font-family: 'Cairo', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 800;">تم شحن طلبك!</h1>
            <p>مرحباً ${updatedOrder.shippingAddress.fullName}،</p>
            <p>أخبار رائعة! تم شحن طلبك رقم <strong>${updatedOrder.orderNumber}</strong> وهو الآن في طريقه إليك.</p>
            <a href="${baseUrl}/order-tracking?order=${updatedOrder.orderNumber}" 
               style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block; margin-top: 20px;">
               تتبع طلبك
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 40px;">متجر عدة - أدوات طب الأسنان المتميزة</p>
          </div>
        `;

        if (locale === 'ar' && settings?.shippedSubjectAr && settings?.shippedBodyAr) {
          subject = settings.shippedSubjectAr.replace(/{{orderNumber}}/g, updatedOrder.orderNumber);
          htmlContent = settings.shippedBodyAr
            .replace(/{{customerName}}/g, updatedOrder.shippingAddress.fullName)
            .replace(/{{orderNumber}}/g, updatedOrder.orderNumber);
        } else if (locale === 'en' && settings?.shippedSubjectEn && settings?.shippedBodyEn) {
          subject = settings.shippedSubjectEn.replace(/{{orderNumber}}/g, updatedOrder.orderNumber);
          htmlContent = settings.shippedBodyEn
            .replace(/{{customerName}}/g, updatedOrder.shippingAddress.fullName)
            .replace(/{{orderNumber}}/g, updatedOrder.orderNumber);
        } else {
          subject = locale === 'ar' ? `أودا - تم شحن طلبك رقم ${updatedOrder.orderNumber}` : `Odda - Your Order #${updatedOrder.orderNumber} has Shipped!`;
          htmlContent = locale === 'ar' ? fallbackHtmlAr : fallbackHtmlEn;
        }

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

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;
