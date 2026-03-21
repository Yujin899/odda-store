import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StoreSettings, IStoreSettings } from '@/models/StoreSettings';
import { auth } from '@/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let settings = await StoreSettings.findOne();

    if (!settings) {
      // Create default settings if they don't exist
      settings = await StoreSettings.create({
        hero: {
          image: '',
          heading: "Browse premium instruments",
          buttonText: "Shop Now",
          buttonLink: "/products"
        },
        announcements: ["Welcome to Odda Store"],
        instapayNumber: "01126131495",
        shippingFee: 0,
        contactEmail: "contact@oddastore.com",
        storeDescription: "Precision Clinical Instruments for the next generation of dental professionals.",
        socialLinks: { facebook: "", instagram: "" },
        defaultLanguage: "en",
        theme: {
          primary: '#0073E6',
          primaryForeground: '#FFFFFF',
          secondary: '#F1F5F9',
          secondaryForeground: '#0A192F',
          accent: '#F8FAFC',
          accentForeground: '#0A192F',
          background: '#FFFFFF',
          foreground: '#0A192F',
          border: '#E2E8F0',
          radius: '0.5rem',
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const PATCH = auth(async (req) => {
  if (req.auth?.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const rawBody = await req.json();
    const body = { ...rawBody } as Partial<IStoreSettings> & Record<string, unknown>;
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.__v;
    
    // IMAGE CLEANUP LOGIC: Delete removed hero image from Cloudinary
    if (body.hero?.image) {
      const existingSettings = await StoreSettings.findOne();
      if (existingSettings && existingSettings.hero?.image && existingSettings.hero.image !== body.hero.image) {
        // Old image exists and is different from new image
        await deleteCloudinaryImage(existingSettings.hero.image);
      }
    }

    // Update the single document. Upsert if none exists.
    const settings = await StoreSettings.findOneAndUpdate(
      {},
      { $set: body },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );
    
    // CRITICAL: Ensure only one document exists to prevent read-write mismatch
    const count = await StoreSettings.countDocuments();
    if (count > 1) {
      await StoreSettings.deleteMany({ _id: { $ne: settings._id } });
    }

    // Purge the storefront cache so new settings reflect instantly
    revalidatePath('/', 'layout');
    revalidateTag('store-settings', 'page');
    
    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error('Settings update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});
