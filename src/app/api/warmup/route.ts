import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

/**
 * Lightweight warmup endpoint.
 * Called by UptimeRobot every 5 minutes to keep
 * the Next.js serverless function and MongoDB connection alive.
 */
export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      ok: true, 
      timestamp: new Date().toISOString() 
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
