import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { deleteImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await connectDB();

    // Find orders older than 30 days with status delivered or cancelled
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersToCleanup = await Order.find({
      createdAt: { $lt: thirtyDaysAgo },
      status: { $in: ['delivered', 'cancelled'] }
    });

    console.log(`Starting full cleanup for ${ordersToCleanup.length} orders...`);

    let successCount = 0;
    let failCount = 0;

    for (const order of ordersToCleanup) {
      try {
        // 1. Extract and delete Cloudinary public_id from paymentProof if it exists
        const url = order.paymentProof;
        if (url) {
          const parts = url.split('/');
          const uploadIndex = parts.indexOf('upload');
          if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
            const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
            const publicId = publicIdWithExtension.split('.')[0];
            
            if (publicId) {
              await deleteImage(publicId);
            }
          }
        }

        // 2. Permanently delete the order from DB
        await Order.findByIdAndDelete(order._id);
        successCount++;
      } catch (error) {
        console.error(`Failed to fully cleanup order ${order._id}:`, error);
        failCount++;
      }
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      processed: ordersToCleanup.length,
      success: successCount,
      failed: failCount
    });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
