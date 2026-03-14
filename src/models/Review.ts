import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  targetId: mongoose.Types.ObjectId;
  targetType: 'Product' | 'Bundle';
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    targetId: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      refPath: 'targetType' 
    },
    targetType: { 
      type: String, 
      required: true, 
      enum: ['Product', 'Bundle'] 
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { 
    timestamps: true,
    collection: 'reviews'
  }
);

// Index for fast lookups by target
ReviewSchema.index({ targetId: 1, targetType: 1 });
// Index for user reviews (to prevent/check duplicates if needed)
ReviewSchema.index({ user: 1, targetId: 1, targetType: 1 });

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
