import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { BundlePageClient } from '@/components/bundles/BundlePageClient';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

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

  return <BundlePageClient bundle={bundle} />;
}
