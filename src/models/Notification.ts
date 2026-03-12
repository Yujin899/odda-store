import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'new_order' | 'system' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['new_order', 'system', 'alert'], 
      default: 'system' 
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> = 
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
