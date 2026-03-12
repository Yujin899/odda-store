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
        const bulkOps = order.items.map((item: any) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } }
          }
        }));
        await Product.bulkWrite(bulkOps);
      } catch (stockRestoreErr) {
        console.error('Stock restoration error:', stockRestoreErr);
      }
    }

    // 3. UPDATE STATUS
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    // --- ASYNC ACTIONS: STATUS UPDATE EMAIL ---
    // Rule: Only send for shipped and delivered to save quota
    if (['shipped', 'delivered'].includes(status) && order.shippingAddress?.email) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const statusLabels: Record<string, string> = {
          'shipped': 'has been shipped',
          'delivered': 'has been delivered',
        };

        await resend.emails.send({
          from: 'Odda Store <onboarding@resend.dev>',
          to: order.shippingAddress.email,
          subject: `Order Update - ${order.orderNumber}`,
          html: `
            <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; text-transform: uppercase;">Order Update</h1>
              <p>Hi ${order.shippingAddress.fullName},</p>
              <p>Your order <strong>${order.orderNumber}</strong> ${statusLabels[status]}.</p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: 700;">New Status: <span style="text-transform: uppercase; color: #3b82f6;">${status}</span></p>
              </div>
              <a href="${baseUrl}/order-confirmation?order=${order._id.toString()}" 
                 style="background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-block;">
                 View Tracking Details
              </a>
              <p style="font-size: 12px; color: #64748b; margin-top: 40px;">Odda Store - Premium Streetwear</p>
            </div>
          `,
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
