import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: mongoose.Types.ObjectId;
}

const CategorySchema: Schema<ICategoryDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    descriptionAr: { type: String },
    image: { type: String }, // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
