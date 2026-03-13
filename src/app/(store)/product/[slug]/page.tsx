import { notFound } from 'next/navigation';
import { ProductPageClient } from '@/components/products/ProductPageClient';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

async function getProduct(slug: string) {
  await connectDB();
  // Register models for population
  Category;
  Badge;

  const product = await Product.findOne({
    $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : undefined }].filter(Boolean)
  })
  .populate({ path: 'categoryId', strictPopulate: false })
  .populate({ path: 'badgeId', strictPopulate: false })
  .lean();

  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  await connectDB();
  const products = await Product.find({
    categoryId: categoryId,
    _id: { $ne: currentProductId }
  })
  .populate({ path: 'badgeId', strictPopulate: false })
  .limit(4)
  .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId?._id || '', product._id);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
