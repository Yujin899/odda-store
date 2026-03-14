import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { ProductPageClient } from '@/components/products/ProductPageClient';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { Review } from '@/models/Review';
import type { Metadata, ResolvingMetadata } from 'next';

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found | Odda' };
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isAr = locale === 'ar';

  const brandAr = 'عُدّة (عدة) أدوات أسنان للطلاب | Odda';
  const brandEn = 'Odda | Dental Student Gear';

  const titlePrefix = isAr ? (product.nameAr || product.name) : product.name;
  const title = isAr 
    ? `${titlePrefix.slice(0, 60 - brandAr.length - 3)} | ${brandAr}`
    : `${titlePrefix.slice(0, 60 - brandEn.length - 3)} | ${brandEn}`;

  const rawDescription = isAr ? product.descriptionAr || product.description : product.description;
  let description = rawDescription?.slice(0, 155) || '';
  
  if (isAr && description.length < 120) {
    description += ' لطلاب الـ Preclinical والـ Clinical';
  }

  const ogImage = product.images?.[0]?.url || '/og-default.png';

  return {
    title,
    description: description.slice(0, 155),
    openGraph: {
      title,
      description: description.slice(0, 155),
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 155),
      images: [ogImage],
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

async function getReviews(productId: string) {
  await connectDB();
  const reviews = await Review.find({ targetId: productId, targetType: 'Product' })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(reviews));
}

async function getProduct(slug: string) {
  await connectDB();
  // Register models for population
  void Category.modelName;
  void Badge.modelName;

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
  // Register models for population
  if (mongoose.models && mongoose.models.Badge) Badge.modelName;
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

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  const relatedProducts = await getRelatedProducts(product.categoryId?._id || '', product._id);
  const reviews = await getReviews(product._id);

  // Normalize for Client Component which expects .category instead of .categoryId
  const productWithCategory = {
    ...product,
    category: product.categoryId || { name: 'Uncategorized' }
  };

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'ar' ? productWithCategory.nameAr || productWithCategory.name : productWithCategory.name,
    description: (locale === 'ar' ? productWithCategory.descriptionAr || productWithCategory.description : productWithCategory.description)?.slice(0, 155),
    image: productWithCategory.images?.[0]?.url,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: productWithCategory.price,
      availability: productWithCategory.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.odda-store.com'}/product/${productWithCategory.slug}`,
    },
    aggregateRating: productWithCategory.numReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: productWithCategory.averageRating,
      reviewCount: productWithCategory.numReviews,
    } : undefined,
  };

  // Strict DTO Mapping
  const sanitizedProduct = {
    _id: productWithCategory._id.toString(),
    name: productWithCategory.name,
    nameAr: productWithCategory.nameAr,
    slug: productWithCategory.slug,
    description: productWithCategory.description,
    descriptionAr: productWithCategory.descriptionAr,
    price: productWithCategory.price,
    compareAtPrice: productWithCategory.compareAtPrice,
    images: (productWithCategory.images || []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary
    })),
    category: {
      _id: productWithCategory.category._id?.toString() || '',
      name: productWithCategory.category.name,
      nameAr: productWithCategory.category.nameAr
    },
    badge: productWithCategory.badgeId ? {
      name: productWithCategory.badgeId.name,
      nameAr: productWithCategory.badgeId.nameAr,
      color: productWithCategory.badgeId.color
    } : null,
    stock: productWithCategory.stock,
    averageRating: productWithCategory.averageRating || 0,
    numReviews: productWithCategory.numReviews || 0,
    features: productWithCategory.features || [],
    featuresAr: productWithCategory.featuresAr || []
  };

  const sanitizedRelated = relatedProducts.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    price: p.price,
    images: (p.images || []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary
    })),
    averageRating: p.averageRating || 0,
    numReviews: p.numReviews || 0
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient 
        product={sanitizedProduct as any} 
        relatedProducts={sanitizedRelated as any} 
        initialReviews={reviews} 
        locale={locale} 
      />
    </>
  );
}
