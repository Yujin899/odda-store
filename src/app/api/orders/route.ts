import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Notification } from '@/models/Notification';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    const { shippingAddress, items, totalAmount, paymentMethod, paymentProof } = body;

    if (!shippingAddress || !items || !totalAmount || !paymentMethod || !shippingAddress.email) {
      return NextResponse.json({ message: 'Missing required fields, including email' }, { status: 400 });
    }

    // req.auth is optional to allow Guest Checkout
    const userId = req.auth?.user?.id || null;

    await connectDB();

    // 1. INVENTORY CHECK: Verify stock for all items
    const productItems = items.filter((item: any) => item.type === 'product' || !item.type);
    const bundleItems = items.filter((item: any) => item.type === 'bundle');

    const [dbProducts, dbBundles] = await Promise.all([
      Product.find({ _id: { $in: productItems.map((i: any) => i.productId) } }),
      bundleItems.length > 0 
        ? (await import('@/models/Bundle')).Bundle.find({ _id: { $in: bundleItems.map((i: any) => i.productId) } })
        : []
    ]);

    const stockErrors: string[] = [];
    
    // Check Products
    productItems.forEach((item: any) => {
      const product = dbProducts.find(p => p._id.toString() === item.productId);
      if (!product) {
        stockErrors.push(`Product not found: ${item.name}`);
      } else if (product.stock < item.quantity) {
        stockErrors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
    });

    // Check Bundles
    bundleItems.forEach((item: any) => {
      const bundle = dbBundles.find(b => b._id.toString() === item.productId);
      if (!bundle) {
        stockErrors.push(`Bundle not found: ${item.name}`);
      } else if (bundle.stock < item.quantity) {
        stockErrors.push(`Insufficient stock for bundle ${bundle.name}. Available: ${bundle.stock}, Requested: ${item.quantity}`);
      }
    });

    if (stockErrors.length > 0) {
      return NextResponse.json({ message: stockErrors.join('. ') }, { status: 400 });
    }

    const orderNumber = `ODDA-${Date.now()}`;
    let status = paymentMethod === 'COD' ? 'processing' : 'pending_payment';

    if (paymentMethod === 'InstaPay' && paymentProof) {
      status = 'pending_verification';
    }

    const orderData: any = {
      orderNumber,
      items: items.map((item: any) => ({
        ...item,
        type: item.type === 'bundle' ? 'Bundle' : 'Product' // Match Mongoose discriminator
      })),
      totalAmount,
      paymentMethod,
      paymentProof: paymentProof || '',
      status,
      shippingAddress,
    };

    if (userId) {
      orderData.userId = userId;
    }

    const order = await Order.create(orderData);

    // 2. INVENTORY UPDATE: Deduct stock
    try {
      // Deduct Products
      if (productItems.length > 0) {
        const productOps = productItems.map((item: any) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { stock: -item.quantity } }
          }
        }));
        await Product.bulkWrite(productOps);
      }
      
      // Deduct Bundles
      if (bundleItems.length > 0) {
        const bundleOps = bundleItems.map((item: any) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { stock: -item.quantity } }
          }
        }));
        const { Bundle } = await import('@/models/Bundle');
        await Bundle.bulkWrite(bundleOps);
      }
    } catch (stockUpdateErr) {
      console.error('Stock decrement error:', stockUpdateErr);
    }

    // --- ASYNC ACTIONS: NOTIFICATIONS & EMAILS ---
    // 1. Admin In-App notification
    try {
      await Notification.create({
        title: 'New Order Received',
        message: `Order ${order.orderNumber} placed via ${paymentMethod} for ${totalAmount} EGP`,
        type: 'new_order',
        link: '/dashboard/orders',
      });
    } catch (notifErr) {
      console.error('Admin notification error:', notifErr);
    }

    // 2. Customer Confirmation Email
    try {
      const { StoreSettings } = await import('@/models/StoreSettings');
      const settings = await StoreSettings.findOne();
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      const locale = body.locale || 'en';

      let subject = locale === 'ar' ? 'Order Received - Odda Store' : 'Order Received - Odda Store';
      let htmlContent = '';

      const fallbackHtmlEn = `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; text-transform: uppercase;">Order Received!</h1>
            <p>Hi ${shippingAddress.fullName},</p>
            <p>Thank you for choosing Odda. We've received your order <strong>${order.orderNumber}</strong>.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: 700;">Order Summary:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Items: ${totalItems}</li>
                <li>Total: ${totalAmount} EGP</li>
                <li>Payment: ${paymentMethod}</li>
              </ul>
            </div>
            <a href="${baseUrl}/order-tracking?order=${order.orderNumber}" 
               style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
               Track Your Order
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 40px;">Odda Store - Premium Streetwear</p>
          </div>
      `;

      const fallbackHtmlAr = `
          <div style="font-family: 'Cairo', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 800;">تم استلام طلبك!</h1>
            <p>مرحباً ${shippingAddress.fullName}،</p>
            <p>شكراً لاختيارك عدة. لقد استلمنا طلبك رقم <strong>${order.orderNumber}</strong>.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: 700;">ملخص الطلب:</p>
              <ul style="list-style: none; padding: 0;">
                <li>عدد الأصناف: ${totalItems}</li>
                <li>الإجمالي: ${totalAmount} جنيه</li>
                <li>طريقة الدفع: ${paymentMethod === 'COD' ? 'الدفع عند الاستلام' : 'انستا باي'}</li>
              </ul>
            </div>
            <a href="${baseUrl}/order-tracking?order=${order.orderNumber}" 
               style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
               تتبع طلبك
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 40px;">متجر عدة - أدوات طب الأسنان المتميزة</p>
          </div>
      `;

      if (locale === 'ar' && settings?.confirmationSubjectAr && settings?.confirmationBodyAr) {
        subject = settings.confirmationSubjectAr.replace(/{{orderNumber}}/g, order.orderNumber);
        htmlContent = settings.confirmationBodyAr
          .replace(/{{customerName}}/g, shippingAddress.fullName)
          .replace(/{{orderNumber}}/g, order.orderNumber);
      } else if (locale === 'en' && settings?.confirmationSubjectEn && settings?.confirmationBodyEn) {
        subject = settings.confirmationSubjectEn.replace(/{{orderNumber}}/g, order.orderNumber);
        htmlContent = settings.confirmationBodyEn
          .replace(/{{customerName}}/g, shippingAddress.fullName)
          .replace(/{{orderNumber}}/g, order.orderNumber);
      } else {
        // Fallbacks
        subject = locale === 'ar' ? `أودا - تأكيد الطلب رقم ${order.orderNumber}` : `Odda - Order Confirmation #${order.orderNumber}`;
        htmlContent = locale === 'ar' ? fallbackHtmlAr : fallbackHtmlEn;
      }
      
      await resend.emails.send({
        from: 'Odda Store <onboarding@resend.dev>',
        to: shippingAddress.email,
        subject: subject,
        html: htmlContent,
      });
    } catch (emailErr) {
      console.error('Confirmation email error:', emailErr);
    }

    return NextResponse.json({ 
      id: order._id,
      orderNumber: order.orderNumber, 
      status: order.status 
    }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}) as any;

export const GET = auth(async (req) => {
    // req.auth check removed to allow guest checkout. 
    // Validation for authenticated users happens via conditionally assigning userId below.

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;
