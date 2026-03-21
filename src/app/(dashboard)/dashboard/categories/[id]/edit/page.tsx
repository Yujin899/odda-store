import { cookies } from 'next/headers';
import { getDictionary } from '@/dictionaries';
import { CategoryPageForm } from '@/components/dashboard/CategoriesParts/CategoryPageForm';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: Props) {
  await connectDB();
  const { id } = await params;
  
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(locale as 'en' | 'ar');

  const category = await Category.findById(id).lean();

  if (!category) {
    notFound();
  }

  return (
    <>
      <CategoryPageForm 
        dict={dict} 
        language={locale} 
        initialData={JSON.parse(JSON.stringify(category))} 
      />
    </>
  );
}
