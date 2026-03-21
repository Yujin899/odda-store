import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { BundlePageClient } from '@/components/bundles/BundlePageClient';
import { Review } from '@/models/Review';
import { cookies } from 'next/headers';
import type { Metadata, ResolvingMetadata } from 'next';

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundle(slug);

  if (!bundle) {
    return { title: 'Bundle Not Found | Odda' };
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isAr = locale === 'ar';

  const brandAr = 'عُدّة (عدة) أقوى العروض والباكدجات | Odda';
  const brandEn = 'Odda | Best Dental Bundles & Kits';

  const titlePrefix = isAr ? (bundle.nameAr || bundle.name) : bundle.name;
  const title = isAr 
    ? `${titlePrefix.slice(0, 60 - brandAr.length - 3)} | ${brandAr}`
    : `${titlePrefix.slice(0, 60 - brandEn.length - 3)} | ${brandEn}`;

  const rawDescription = isAr ? bundle.descriptionAr || bundle.description : bundle.description;
  let description = rawDescription?.slice(0, 155) || '';
  
  if (isAr && description.length < 120) {
    description += ' عروض حصرية لطلبة الأسنان - Preclinical & Clinical';
  }

  const ogImage = bundle.images?.[0]?.url || '/og-default.png';

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

async function getReviews(bundleId: string) {
  await connectDB();
  const reviews = await Review.find({ targetId: bundleId, targetType: 'Bundle' })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(reviews));
}

async function getBundle(slug: string) {
  await connectDB();
  const bundle = await Bundle.findOne({ slug }).lean();
  if (!bundle) return null;
  return JSON.parse(JSON.stringify(bundle));
}

export default async function BundleDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const bundle = await getBundle(slug);

  if (!bundle) {
    notFound();
  }

  const reviews = await getReviews(bundle._id);

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'ar' ? bundle.nameAr || bundle.name : bundle.name,
    description: (locale === 'ar' ? bundle.descriptionAr || bundle.description : bundle.description)?.slice(0, 155),
    image: bundle.images?.[0]?.url,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: bundle.price,
      availability: bundle.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.odda-store.com'}/bundle/${bundle.slug}`,
    },
  };

  // Strict DTO Mapping
  const sanitizedBundle = {
    _id: bundle._id.toString(),
    name: bundle.name,
    nameAr: bundle.nameAr,
    slug: bundle.slug,
    description: bundle.description,
    descriptionAr: bundle.descriptionAr,
    price: bundle.price,
    originalPrice: bundle.originalPrice,
    images: (bundle.images || []).map((url: string) => url),
    stock: bundle.stock,
    bundleItems: bundle.bundleItems || [],
    bundleItemsAr: bundle.bundleItemsAr || [],
    averageRating: bundle.averageRating || 0,
    numReviews: bundle.numReviews || 0
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BundlePageClient 
        bundle={sanitizedBundle as any} 
        initialReviews={reviews} 
        locale={locale} 
      />
    </>
  );
}
