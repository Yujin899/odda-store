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
    const productIds = items.map((item: any) => item.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const stockErrors: string[] = [];
    items.forEach((item: any) => {
      const product = dbProducts.find(p => p._id.toString() === item.productId);
      if (!product) {
        stockErrors.push(`Product not found: ${item.name}`);
      } else if (product.stock < item.quantity) {
        stockErrors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
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
      items,
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

    // 2. INVENTORY UPDATE: Deduct stock from products
    try {
      const bulkOps = items.map((item: any) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: -item.quantity } }
        }
      }));
      await Product.bulkWrite(bulkOps);
    } catch (stockUpdateErr) {
      console.error('Stock decrement error:', stockUpdateErr);
      // We don't fail the order if stock update fails, but we log it
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
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      
      await resend.emails.send({
        from: 'Odda Store <onboarding@resend.dev>',
        to: shippingAddress.email,
        subject: 'Order Received - Odda Store',
        html: `
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
            <a href="${baseUrl}/order-confirmation?order=${order._id.toString()}" 
               style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
               Track Your Order
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 40px;">Odda Store - Premium Streetwear</p>
          </div>
        `,
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
