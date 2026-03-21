import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  features?: string[];
  featuresAr?: string[];
  averageRating: number;
  numReviews: number;
  price: number;
  originalPrice?: number;
  images: {
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
  categoryId: mongoose.Types.ObjectId;
  badgeId?: mongoose.Types.ObjectId;
  stock: number;
  category?: string;
  badge?: string;
  inStock?: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProduct, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    nameAr: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    descriptionAr: { type: String },
    features: [{ type: String }],
    featuresAr: [{ type: String }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
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

ProductSchema.virtual('inStockVirtual').get(function () {
  return this.stock > 0;
});

export const Product: Model<IProductDocument> = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
