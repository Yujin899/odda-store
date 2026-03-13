import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { auth } from '@/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
