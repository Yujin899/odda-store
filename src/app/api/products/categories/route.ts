import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct('category');
    
    return NextResponse.json(
      { categories },
      { 
        headers: { 
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' 
        } 
      }
    );
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
