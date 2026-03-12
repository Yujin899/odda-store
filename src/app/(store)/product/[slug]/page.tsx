import { notFound } from 'next/navigation';
import { ProductPageClient } from '@/components/products/ProductPageClient';

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.AUTH_URL || 'http://localhost:3000'}/api/products/${slug}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const res = await fetch(`${process.env.AUTH_URL || 'http://localhost:3000'}/api/products?categoryId=${encodeURIComponent(categoryId)}&limit=5`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.products || []).filter((p: any) => p._id !== currentProductId).slice(0, 4);
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
