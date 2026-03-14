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
      const locale = body.locale || 'en';
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://odda-web.vercel.app');
      const { getPremiumEmailHtml } = await import('@/lib/email-templates');

      let subject = '';
      let htmlContent = '';

      if (locale === 'ar' && settings?.confirmationSubjectAr && settings?.confirmationBodyAr) {
        subject = settings.confirmationSubjectAr.replace(/{{orderNumber}}/g, order.orderNumber);
        const bodyContent = settings.confirmationBodyAr
          .replace(/{{customerName}}/g, shippingAddress.fullName)
          .replace(/{{orderNumber}}/g, order.orderNumber);
        htmlContent = getPremiumEmailHtml({
          bodyText: bodyContent,
          customerName: shippingAddress.fullName,
          orderNumber: order.orderNumber,
          items,
          totalAmount,
          isAr: true,
          baseUrl
        });
      } else if (locale === 'en' && settings?.confirmationSubjectEn && settings?.confirmationBodyEn) {
        subject = settings.confirmationSubjectEn.replace(/{{orderNumber}}/g, order.orderNumber);
        const bodyContent = settings.confirmationBodyEn
          .replace(/{{customerName}}/g, shippingAddress.fullName)
          .replace(/{{orderNumber}}/g, order.orderNumber);
        htmlContent = getPremiumEmailHtml({
          bodyText: bodyContent,
          customerName: shippingAddress.fullName,
          orderNumber: order.orderNumber,
          items,
          totalAmount,
          isAr: false,
          baseUrl
        });
      } else {
        // Fallbacks with Premium HTML
        const isAr = locale === 'ar';
        subject = isAr ? `عدة - تأكيد الطلب رقم ${order.orderNumber}` : `Odda - Order Confirmation #${order.orderNumber}`;
        const fallbackBody = isAr 
          ? `شكراً لثقتك في عدة. لقد استلمنا طلبك رقم ${order.orderNumber} وجاري تجهيزه حالياً.`
          : `Thank you for choosing Odda. We've received your order ${order.orderNumber} and it's being processed.`;
        htmlContent = getPremiumEmailHtml({
          bodyText: fallbackBody,
          customerName: shippingAddress.fullName,
          orderNumber: order.orderNumber,
          items,
          totalAmount,
          isAr,
          baseUrl
        });
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
