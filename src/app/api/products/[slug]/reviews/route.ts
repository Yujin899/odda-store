/**
 * Forced re-build to resolve stale Turbopack error: Module not found: Can't resolve '@/lib/dbConnect'
 * Last Updated: 2026-03-13T23:02:40+02:00
 */
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import { connectDB } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({ 
      targetId: product._id, 
      targetType: 'Product' 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: error.message }, { status: 500 });
  }
}

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

    // 3. (Optional) Check for existing review - Disabled as multiple reviews are now allowed

    // 4. Create new review
    await Review.create({
      user: new mongoose.Types.ObjectId(session.user.id),
      userName: (session.user as any).name || 'Anonymous',
      targetId: product._id,
      targetType: 'Product',
      rating: ratingNum,
      comment
    });

    // 5. Atomic Aggregation for Parent Document
    const stats = await Review.aggregate([
      { $match: { targetId: product._id, targetType: 'Product' } },
      {
        $group: {
          _id: '$targetId',
          numReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length > 0) {
      product.numReviews = stats[0].numReviews;
      product.averageRating = stats[0].averageRating;
      await product.save();
    }

    return NextResponse.json({ 
      message: 'Review added successfully',
      numReviews: product.numReviews,
      averageRating: product.averageRating
    }, { status: 201 });
  } catch (error: any) {
    console.error('Review submission error:', error);
    return NextResponse.json({ message: 'Failed to add review', error: error.message }, { status: 500 });
  }
}
