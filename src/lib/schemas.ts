import { z } from 'zod';

/**
 * Product Validation Schema
 */
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameAr: z.string().optional(),
  slug: z.string().min(1, 'SEO Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly (lowercase, numbers, and dashes only)'),
  description: z.string().min(1, 'Description is required'),
  descriptionAr: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  originalPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Category is required'),
  badgeId: z.string().optional().nullable().transform(v => v === 'none' ? null : v),
  stock: z.preprocess((val) => Number(val), z.number().int().min(0, 'Stock cannot be negative')),
  featured: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  featuresAr: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean(),
    order: z.number()
  })).min(1, 'At least one image is required'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

/**
 * Bundle Validation Schema
 */
export const bundleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  originalPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  bundleItems: z.array(z.string().min(1, 'Item name cannot be empty')).min(1, 'At least one item is required'),
  bundleItemsAr: z.array(z.string().optional()).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

export type BundleFormValues = z.infer<typeof bundleSchema>;

/**
 * Checkout Validation Schema
 */
export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(
    /^(?:\+20|0)?1[0125]\d{8}$|^(\+\d{1,3}[- ]?)?\d{10}$/,
    'Invalid phone number. Use Egyptian (01x...) or International format.'
  ),
  address: z.string().min(5, 'Specific address is required for delivery'),
  city: z.string().min(1, 'Please select your city'),
  paymentMethod: z.enum(['cod', 'instapay']),
  paymentProof: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'instapay' && !data.paymentProof) {
    return false;
  }
  return true;
}, {
  message: "Screenshot of payment proof is required for InstaPay",
  path: ["paymentProof"],
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

/**
 * Order Item Schema (Internal use)
 */
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
  type: z.enum(['product', 'bundle']).optional().default('product'),
});

/**
 * Full Order Submission Schema
 */
export const orderSubmissionSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    email: z.string().email(),
  }),
  items: z.array(orderItemSchema).min(1),
  totalAmount: z.number(),
  paymentMethod: z.enum(['COD', 'InstaPay']),
  paymentProof: z.string().optional(),
  locale: z.string().optional(),
});
