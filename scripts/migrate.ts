import { connectDB } from '../src/lib/mongodb';
import { Product } from '../src/models/Product';
import Badge from '../src/models/Badge';
import Category from '../src/models/Category';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const defaultBadges = [
  { name: "🔥 Hot Now", color: "#ef4444", textColor: "#ffffff" },
  { name: "✨ New", color: "#0073E6", textColor: "#ffffff" },
  { name: "💎 Best Seller", color: "#059669", textColor: "#ffffff" },
  { name: "-20%", color: "#facc15", textColor: "#0A192F" },
  { name: "-50%", color: "#f97316", textColor: "#ffffff" },
  { name: "Limited", color: "#8b5cf6", textColor: "#ffffff" },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

async function migrate() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not defined');

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected.');

    // 1. Create default badges
    console.log('Ensuring default badges exist...');
    for (const b of defaultBadges) {
      const existing = await Badge.findOne({ name: b.name });
      if (!existing) {
        await Badge.create(b);
        console.log(`Created badge: ${b.name}`);
      }
    }

    // 2. Create categories from existing products
    console.log('Migrating categories...');
    const uniqueCategoryNames = await Product.distinct('category') as string[];
    const categoryMap: Record<string, any> = {};

    for (const name of uniqueCategoryNames) {
      if (!name) continue;
      const slug = generateSlug(name);
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({ name, slug });
        console.log(`Created category: ${name}`);
      }
      categoryMap[name] = cat._id as mongoose.Types.ObjectId;
    }

    // 3. Migrate products
    console.log('Migrating products...');
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const productCollection = db.collection('products');
    const products = await productCollection.find({}).toArray();
    
    for (const p of products) {
      const updates: any = {};
      let modified = false;

      // Migrate Category
      if (p.category && !p.categoryId) {
        updates.categoryId = categoryMap[p.category];
        modified = true;
      }

      // Migrate Badge
      if (p.badge && !p.badgeId) {
        const badgeDoc = await Badge.findOne({ name: p.badge });
        if (badgeDoc) {
          updates.badgeId = badgeDoc._id;
          modified = true;
        }
      }

      // Migrate Stock
      if (typeof p.stock !== 'number') {
        updates.stock = p.inStock === true ? 50 : 0;
        modified = true;
      }

      // Migrate Images
      if (Array.isArray(p.images) && p.images.length > 0 && typeof p.images[0] === 'string') {
        const oldImages = p.images as string[];
        updates.images = oldImages.map((url, index) => ({
          url,
          isPrimary: index === 0,
          order: index
        }));
        modified = true;
      }

      if (modified) {
        await productCollection.updateOne({ _id: p._id }, { $set: updates });
        console.log(`Migrated: ${p.name}`);
      } else {
        console.log(`Skipped (already migrated or no changes): ${p.name}`);
      }
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected.');
    }
  }
}

migrate();
