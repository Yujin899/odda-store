import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId | string;
  type: 'Product' | 'Bundle';
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'InstaPay';
  paymentProof?: string;
  status: 'pending_payment' | 'pending_verification' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    email: string;
  };
  locale: 'en' | 'ar';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Changed to required: false
    items: [
      {
        productId: { 
          type: Schema.Types.ObjectId, 
          required: true,
          refPath: 'items.type' 
        },
        type: { 
          type: String, 
          required: true, 
          enum: ['Product', 'Bundle'],
          default: 'Product'
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'InstaPay'], required: true },
    paymentProof: { type: String },
    status: {
      type: String,
      enum: ['pending_payment', 'pending_verification', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending_payment',
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      email: { type: String, required: true },
    },
    locale: { type: String, enum: ['en', 'ar'], default: 'en' },
  },
  { timestamps: true }
);

// Set appropriate default status based on payment method
OrderSchema.pre('save', async function (this: IOrder) {
  if (this.isNew) {
    if (this.paymentMethod === 'COD') {
      this.status = 'processing';
    } else if (this.paymentMethod === 'InstaPay') {
      this.status = 'pending_payment';
    }
  }
});

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
