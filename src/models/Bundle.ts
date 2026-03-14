import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBundle {
  _id?: string | mongoose.Types.ObjectId;
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
  averageRating: number;
  numReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBundleDocument extends IBundle, Document {
  _id: mongoose.Types.ObjectId;
}

const BundleSchema = new Schema<IBundleDocument>(
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
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    collection: 'bundles',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Bundle: Model<IBundleDocument> = mongoose.models.Bundle || mongoose.model<IBundleDocument>('Bundle', BundleSchema);
