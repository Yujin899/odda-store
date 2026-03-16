/**
 * Client-side DTO types for the Odda Store frontend.
 * 
 * These match the shape returned by API routes after DTO mapping.
 * Use in all React components and client-side hooks.
 * 
 * For server-side Mongoose types, use src/types/models.ts instead.
 */

/** Shape of an individual product image */
export interface ProductImage {
  url: string;
  isPrimary: boolean;
  order: number;
}

/** Sanitized product data returned from GET /api/products */
export interface Product {
  id: string;
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  images: ProductImage[];
  image?: string;
  categoryId?: string | { _id: string; name: string; nameAr?: string; slug?: string } | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  categoryNameAr?: string | null;
  category?: { name: string; nameAr?: string; slug?: string };
  badge?: Badge | null;
  badgeId?: string | { _id: string; name: string; nameAr?: string; color: string; textColor: string } | null;
  stock: number;
  featured: boolean;
  aiSummary?: string | null;
  aiSummaryAr?: string | null;
  averageRating?: number;
  numReviews?: number;
  features?: string[];
  featuresAr?: string[];
  createdAt: string;
}

/** Sanitized bundle data returned from GET /api/bundles */
export interface Bundle {
  id: string;
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number | null;
  images: ProductImage[];
  stock: number;
  featured: boolean;
  bundleItems?: string[];
  bundleItemsAr?: string[];
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
}

/** Sanitized category data */
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string | null;
}

/** Visual badge data for products/bundles */
export interface Badge {
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
}

/** Order data for tracking and history */
export interface Order {
  id?: string;
  _id?: string;
  orderNumber?: string;
  customer?: string;
  shippingAddress?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentScreenshot?: string | null;
  status: string;
  userId?: string | { _id?: string; name?: string; email?: string } | null;
  createdAt: string;
}

/** Individual item within an order */
export interface OrderItem {
  productId: string;
  name: string;
  nameAr?: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
  type: 'Product' | 'Bundle';
}

/** Sanitized review data */
export interface Review {
  id: string;
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/** Minimal product shape for related results and carousels */
export type RelatedProduct = {
  id: string;
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  images: ProductImage[];
  image?: string;
  categoryName?: string | null;
  categoryNameAr?: string | null;
  badge?: Badge | null;
  badgeId?: string | { _id: string; name: string; nameAr?: string; color: string; textColor: string } | null;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
};

export type Dictionary = typeof import('@/dictionaries/en.json');
