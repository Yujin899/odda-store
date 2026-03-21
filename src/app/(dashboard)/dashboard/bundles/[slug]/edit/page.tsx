import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Bundle } from '@/models/Bundle';
import { BundleForm } from '@/components/dashboard/BundleForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBundlePage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  
  const bundle = await Bundle.findOne({ slug }).lean();

  if (!bundle) {
    notFound();
  }

  return (
    <>
      <BundleForm initialData={JSON.parse(JSON.stringify(bundle))} />
    </>
  );
}
