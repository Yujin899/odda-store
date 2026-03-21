import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductForm } from '@/components/dashboard/ProductForm';
import { notFound } from 'next/navigation';
import Category from '@/models/Category';
import Badge from '@/models/Badge';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProductPage({ params }: Props) {
  await connectDB();
  const { slug } = await params;

  // Register models
  void Category;
  void Badge;

  const product = await Product.findOne({ slug })
    .populate({ path: 'categoryId', strictPopulate: false })
    .populate({ path: 'badgeId', strictPopulate: false })
    .lean();

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductForm initialData={JSON.parse(JSON.stringify(product))} />
    </>
  );
}
