import { Types } from 'mongoose';

export type ProductDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{ url: string; isPrimary: boolean; order: number; _id?: Types.ObjectId }>;
  categoryId?: Types.ObjectId;
  badgeId?: Types.ObjectId;
  stock: number;
  featured: boolean;
  aiSummary?: string;
  aiSummaryAr?: string;
  numReviews?: number;
  averageRating?: number;
  features?: string[];
  featuresAr?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BundleDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  featured: boolean;
  bundleItems: string[];
  bundleItemsAr?: string[];
  numReviews?: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderDoc = {
  _id: Types.ObjectId;
  orderNumber: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    type: 'Product' | 'Bundle';
  }>;
  totalAmount: number;
  paymentMethod: 'COD' | 'InstaPay';
  paymentScreenshot?: string;
  status: 'confirmed' | 'pending_verification' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDoc = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'customer' | 'admin';
  isBlocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BadgeDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewDoc = {
  _id: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: 'Product' | 'Bundle';
  userId: Types.ObjectId;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};
