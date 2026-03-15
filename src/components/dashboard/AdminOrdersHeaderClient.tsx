'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

export function AdminOrdersHeaderClient() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <div className="flex flex-col gap-1">
      <h1 className={`text-3xl font-bold tracking-tight text-(--navy) ${language === 'ar' ? 'text-end' : ''}`}>
        {dict.dashboard.ordersPage.title}
      </h1>
      <p className={`text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1 ${language === 'ar' ? 'text-end' : ''}`}>
        {dict.dashboard.ordersPage.subtitle}
      </p>
    </div>
  );
}
