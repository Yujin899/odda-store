import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  features?: string[];
  featuresAr?: string[];
  reviews: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  averageRating: number;
  numReviews: number;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number;
  // NEW FIELDS
  images: {
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
  categoryId: mongoose.Types.ObjectId;
  badgeId?: mongoose.Types.ObjectId;
  stock: number;
  // OLD FIELDS (Keep for migration)
  category?: string;
  badge?: string;
  inStock?: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    nameAr: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    descriptionAr: { type: String },
    features: [{ type: String }],
    featuresAr: [{ type: String }],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    originalPrice: { type: Number },
    // REVIEWS
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    // NEW STRUCTURE
    images: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge' },
    stock: { type: Number, default: 0 },
    // OLD FIELDS (Deprecated)
    category: { type: String },
    badge: { type: String },
    inStock: { type: Boolean },
    featured: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for inStock based on stock count
ProductSchema.virtual('inStockVirtual').get(function () {
  return this.stock > 0;
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
