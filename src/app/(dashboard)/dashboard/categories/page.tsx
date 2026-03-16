import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary } from '@/dictionaries';
import { CategoriesClient } from '@/components/dashboard/CategoriesClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Manage Categories | Dashboard',
};

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(locale as 'en' | 'ar');

  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded"></div>
        <div className="h-64 w-full bg-slate-50 animate-pulse rounded"></div>
      </div>
    }>
      <CategoriesClient dict={dict} language={locale} />
    </Suspense>
  );
}
