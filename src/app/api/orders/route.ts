import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Notification } from '@/models/Notification';
import { Product } from '@/models/Product';
import { auth } from '@/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

import { orderSubmissionSchema } from '@/lib/schemas';

export const POST = auth(async (req) => {
  try {
    const body = await req.json();
    
    // 1. ZOD VALIDATION: Strict validation of incoming payload
    const validatedData = orderSubmissionSchema.parse(body);
    const { shippingAddress, items, paymentMethod, paymentProof } = validatedData;

    // req.auth is optional to allow Guest Checkout
    const userId = req.auth?.user?.id || null;

    await connectDB();

    // 2. PRICE & INVENTORY VERIFICATION: Fetch from DB, do NOT trust client total
    const productItems = items.filter(item => item.type === 'product');
    const bundleItems = items.filter(item => item.type === 'bundle');

    const [dbProducts, dbBundles] = await Promise.all([
      Product.find({ _id: { $in: productItems.map(i => i.productId) } }),
      bundleItems.length > 0 
        ? (await import('@/models/Bundle')).Bundle.find({ _id: { $in: bundleItems.map(i => i.productId) } })
        : []
    ]);

    let calculatedTotal = 0;
    const stockErrors: string[] = [];
    const verifiedItems: any[] = [];
    
    // Process Products
    productItems.forEach((item) => {
      const product = dbProducts.find(p => p._id.toString() === item.productId);
      if (!product) {
        stockErrors.push(`Product not found: ${item.name}`);
      } else {
        if (product.stock < item.quantity) {
          stockErrors.push(`Insufficient stock for ${product.name}`);
        }
        calculatedTotal += product.price * item.quantity;
        verifiedItems.push({
          ...item,
          price: product.price, // Use DB price
          type: 'Product' 
        });
      }
    });

    // Process Bundles
    bundleItems.forEach((item) => {
      const bundle = dbBundles.find(b => b._id.toString() === item.productId);
      if (!bundle) {
        stockErrors.push(`Bundle not found: ${item.name}`);
      } else {
        if (bundle.stock < item.quantity) {
          stockErrors.push(`Insufficient stock for bundle ${bundle.name}`);
        }
        calculatedTotal += bundle.price * item.quantity;
        verifiedItems.push({
          ...item,
          price: bundle.price, // Use DB price
          type: 'Bundle'
        });
      }
    });

    if (stockErrors.length > 0) {
      return NextResponse.json({ message: stockErrors.join('. ') }, { status: 400 });
    }

    // Safety: Verify calculated total is within reasonable margin of error (or just use calculated)
    // We'll trust our server-side calculation as the single source of truth.
    
    const orderNumber = `ODDA-${Date.now()}`;
    let status = paymentMethod === 'COD' ? 'processing' : 'pending_payment';

    if (paymentMethod === 'InstaPay' && paymentProof) {
      status = 'pending_verification';
    }

    const orderData: any = {
      orderNumber,
      items: verifiedItems,
      totalAmount: calculatedTotal,
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
        message: `Order ${order.orderNumber} placed via ${paymentMethod} for ${calculatedTotal} EGP`,
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
          totalAmount: calculatedTotal,
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
          totalAmount: calculatedTotal,
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
          totalAmount: calculatedTotal,
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
  try {
    const session = req.auth;
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

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

    // Strict DTO Mapping to prevent PII leakage and metadata exposure
    const sanitizedOrders = orders.map(order => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress?.fullName || 'N/A',
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      userId: order.userId ? {
        name: (order.userId as any).name,
        email: (order.userId as any).email
      } : null
    }));

    return NextResponse.json({
      orders: sanitizedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;
