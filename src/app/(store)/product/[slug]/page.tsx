import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ProductPageClient } from '@/components/products/ProductPageClient';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { Review } from '@/models/Review';
import type { Metadata } from 'next';
import type { ProductDoc, CategoryDoc, BadgeDoc, ReviewDoc } from '@/types/models';
import type { Product as ProductType, RelatedProduct } from '@/types/store';

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params }
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
    .lean<ReviewDoc[]>();
  return reviews.map((r) => ({
    id: r._id.toString(),
    _id: r._id.toString(),
    userName: r.userName || 'Verified Customer',
    rating: r.rating,
    comment: r.comment || '',
    createdAt: r.createdAt.toISOString()
  }));
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
    .lean<ProductDoc>();

  if (!product) return null;
  return {
    ...product,
    _id: product._id.toString(),
    categoryId: product.categoryId ? {
      ...(product.categoryId as unknown as CategoryDoc),
      _id: (product.categoryId as unknown as CategoryDoc)._id.toString()
    } : null,
    badgeId: product.badgeId ? {
      ...(product.badgeId as unknown as BadgeDoc),
      _id: (product.badgeId as unknown as BadgeDoc)._id.toString()
    } : null
  };
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  await connectDB();
  // Register models for population
  // Ensure models are registered for population side-effects
  void Badge?.modelName;
  const products = await Product.find({
    categoryId: categoryId,
    _id: { $ne: currentProductId }
  })
    .populate({ path: 'badgeId', strictPopulate: false })
    .limit(4)
    .lean<ProductDoc[]>();

  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    badgeId: p.badgeId ? {
      ...(p.badgeId as unknown as BadgeDoc),
      _id: (p.badgeId as unknown as BadgeDoc)._id.toString()
    } : null
  }));
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
  const categoryData = (product.categoryId as unknown as CategoryDoc) || { _id: '', name: 'Uncategorized', nameAr: 'غير مصنف', slug: 'uncategorized' };

  const productWithCategory = {
    ...product,
    category: categoryData
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
    aggregateRating: (productWithCategory.numReviews || 0) > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: productWithCategory.averageRating,
      reviewCount: productWithCategory.numReviews,
    } : undefined,
  };

  // Strict DTO Mapping
  const sanitizedProduct = {
    id: productWithCategory._id.toString(),
    _id: productWithCategory._id.toString(),
    name: productWithCategory.name,
    nameAr: productWithCategory.nameAr,
    slug: productWithCategory.slug,
    description: productWithCategory.description,
    descriptionAr: productWithCategory.descriptionAr,
    price: productWithCategory.price,
    originalPrice: productWithCategory.originalPrice ?? null,
    images: (productWithCategory.images || []).map((img: { url: string; isPrimary: boolean; order: number }) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      order: img.order
    })),
    category: {
      _id: (productWithCategory.category as CategoryDoc)._id?.toString() || '',
      name: (productWithCategory.category as CategoryDoc).name,
      nameAr: (productWithCategory.category as CategoryDoc).nameAr,
      slug: (productWithCategory.category as CategoryDoc).slug
    },
    badge: (productWithCategory.badgeId as unknown as BadgeDoc) ? {
      name: (productWithCategory.badgeId as unknown as BadgeDoc).name,
      nameAr: (productWithCategory.badgeId as unknown as BadgeDoc).nameAr,
      color: (productWithCategory.badgeId as unknown as BadgeDoc).color,
      textColor: (productWithCategory.badgeId as unknown as BadgeDoc).textColor
    } : null,
    stock: productWithCategory.stock,
    averageRating: productWithCategory.averageRating || 0,
    numReviews: productWithCategory.numReviews || 0,
    features: productWithCategory.features || [],
    featuresAr: productWithCategory.featuresAr || []
  };

  const sanitizedRelated: RelatedProduct[] = relatedProducts.map((p) => ({
    id: p._id.toString(),
    _id: p._id.toString(),
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    price: p.price,
    images: (p.images || []).map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      order: img.order
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
        product={sanitizedProduct as unknown as ProductType}
        relatedProducts={sanitizedRelated as unknown as RelatedProduct[]}
        initialReviews={reviews}
        locale={locale}
      />
    </>
  );
}
