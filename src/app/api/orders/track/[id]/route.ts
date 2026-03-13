import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();
    
    // Ensure Product model is registered for population
    if (!mongoose.models.Product) {
      mongoose.model('Product', Product.schema);
    }

    const order = await Order.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : new mongoose.Types.ObjectId() },
        { orderNumber: id }
      ]
    })
      .populate({
        path: 'items.productId',
        select: 'name images price slug',
      })
      .select('-userId -paymentProof -updatedAt -__v');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Order tracking fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
