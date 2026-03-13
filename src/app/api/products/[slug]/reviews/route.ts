/**
 * Forced re-build to resolve stale Turbopack error: Module not found: Can't resolve '@/lib/dbConnect'
 * Last Updated: 2026-03-13T23:02:40+02:00
 */
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import { Product } from '@/models/Product';
import { connectDB } from '@/lib/mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { rating } = body;
    let { comment } = body;

    // 1. Validation
    if (rating === undefined || rating === null) {
      return NextResponse.json({ message: 'التقييم مطلوب بالنجوم' }, { status: 400 });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ message: 'التقييم لازم يكون بين 1 و 5 نجوم' }, { status: 400 });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      return NextResponse.json({ message: 'التعليق لازم يكون 3 حروف على الأقل' }, { status: 400 });
    }

    // 2. Safety: Sanitize comment (remove HTML, trim length)
    comment = comment.replace(/<[^>]*>?/gm, '').trim().substring(0, 1000);

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Add new review (Allowing multiple reviews as requested)
    const review = {
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: (session.user as any).name || 'Anonymous',
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };
    
    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.averageRating = 
      product.reviews.reduce((acc: number, item: { rating: number }) => item.rating + acc, 0) / 
      product.reviews.length;

    const savedProduct = await product.save();

    return NextResponse.json({ 
      message: 'Review added successfully', 
      product: savedProduct.toObject() 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Review submission error:', error);
    return NextResponse.json({ message: 'Failed to add review', error: error.message }, { status: 500 });
  }
}
