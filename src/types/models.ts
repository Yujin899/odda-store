/**
 * Server-side Mongoose document types for the Odda Store.
 * 
 * Use these in API routes with lean queries:
 * const products = await Product.find().lean<ProductDoc[]>();
 * 
 * Never import these in client components.
 * For client-side types, use src/types/store.ts instead.
 */

import { Types } from 'mongoose';

/** Mongoose document shape for a Product after .lean() */
export type ProductDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; isPrimary: boolean; order: number; _id?: Types.ObjectId }>;
  categoryId?: Types.ObjectId;
  badgeId?: Types.ObjectId;
  stock: number;
  featured: boolean;
  numReviews?: number;
  averageRating?: number;
  features?: string[];
  featuresAr?: string[];
  createdAt: Date;
  updatedAt: Date;
};

/** Mongoose document shape for a Category after .lean() */
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

/** Mongoose document shape for a Bundle after .lean() */
export type BundleDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
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

/** Mongoose document shape for an Order after .lean() */
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

/** Mongoose document shape for a User after .lean() */
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

/** Mongoose document shape for a Badge after .lean() */
export type BadgeDoc = {
  _id: Types.ObjectId;
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Mongoose document shape for a Review after .lean() */
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
