import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBadgeDocument extends IBadge, Document {
  _id: mongoose.Types.ObjectId;
}

const BadgeSchema: Schema<IBadgeDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    nameAr: { type: String, trim: true },
    color: { type: String, required: true }, // Hex color
    textColor: { type: String, required: true }, // Hex color
  },
  { timestamps: true }
);

export default mongoose.models.Badge || mongoose.model<IBadgeDocument>('Badge', BadgeSchema);
