import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StoreSettings } from '@/models/StoreSettings';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export const revalidate = 3600; // Cache for 1 hour

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
        socialLinks: { facebook: "", instagram: "" }
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
    const body = await req.json();
    
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
      { new: true, upsert: true }
    );

    // Purge the storefront cache so new settings reflect instantly
    revalidatePath('/', 'layout');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}) as any;
