import { CATALOG } from '../src/lib/catalog';
import { connectDB } from '../src/lib/mongodb';
import { Product } from '../src/models/Product';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected.');

    for (const productData of CATALOG) {
      const existing = await Product.findOne({ slug: productData.slug });
      
      if (existing) {
        console.log(`Skipped: ${productData.name} (already exists)`);
      } else {
        await Product.create(productData);
        console.log(`Seeded: ${productData.name}`);
      }
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
}

seed();
