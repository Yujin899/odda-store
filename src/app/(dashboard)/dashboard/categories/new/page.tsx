import { cookies } from 'next/headers';
import { getDictionary } from '@/dictionaries';
import { CategoryPageForm } from '@/components/dashboard/CategoriesParts/CategoryPageForm';

export default async function NewCategoryPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(locale as 'en' | 'ar');

  return (
    <>
      <CategoryPageForm dict={dict} language={locale} />
    </>
  );
}
