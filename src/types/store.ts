export interface ProductImage {
  url: string;
  isPrimary: boolean;
  order: number;
}

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

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string | null;
}

export interface Badge {
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
}

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

export interface Review {
  id: string;
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

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
