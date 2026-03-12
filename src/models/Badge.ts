import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  color: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    color: { type: String, required: true }, // Hex color
    textColor: { type: String, required: true }, // Hex color
  },
  { timestamps: true }
);

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);
