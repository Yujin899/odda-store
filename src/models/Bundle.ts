import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBundle extends Document {
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  bundleItems: string[];
  bundleItemsAr?: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>(
  {
    name: { type: String, required: true },
    nameAr: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    descriptionAr: { type: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    bundleItems: [{ type: String }],
    bundleItemsAr: [{ type: String }],
    stock: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    collection: 'bundles',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Bundle: Model<IBundle> = mongoose.models.Bundle || mongoose.model<IBundle>('Bundle', BundleSchema);
