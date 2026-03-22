'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { AddProductButton } from './AddProductButton';

export function AdminProductsHeaderClient() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={language === 'ar' ? 'text-end' : 'text-start'}>
        <h1 className="text-3xl font-bold tracking-tight text-navy">
          {dict.dashboard.productsPage.title}
        </h1>
        <p className={`text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1 ${language === 'ar' ? 'text-end' : ''}`}>
          {dict.dashboard.productsPage.subtitle}
        </p>
      </div>
      <AddProductButton />
    </div>
  );
}
