import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  
  try {
    const formData = await req.formData();
    const folder = formData.get('folder') as string || 'odda/general';

    // Guard: Only admins can upload to general folders. 
    // Users can only upload to 'payment_proofs'.
    const isAdmin = session?.user && (session.user as { role?: string }).role === 'admin';
    const isPaymentProof = folder === 'payment_proofs';

    if (!isAdmin && !isPaymentProof) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type. Only JPG, PNG and WebP allowed.' }, { status: 400 });
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'File too large. Max 10MB allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadImage(buffer, folder);

    return NextResponse.json({ url, publicId });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Upload Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', error: error },
      { status: 500 }
    );
  }
}
