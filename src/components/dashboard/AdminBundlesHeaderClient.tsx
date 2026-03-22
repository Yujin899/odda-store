'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

export function AdminBundlesHeaderClient() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isAr = language === 'ar';

  return (
    <div className={`flex flex-col gap-1 ${isAr ? 'text-end' : 'text-start'}`}>
      <h1 className={`text-2xl font-black uppercase tracking-tighter text-navy ${isAr ? 'font-cairo' : ''}`}>
        {isAr ? 'العروض والحقائب' : 'Bundles & Starter Kits'}
      </h1>
      <p className={`text-xs font-bold text-slate-400 uppercase tracking-widest ${isAr ? 'font-cairo' : ''}`}>
        {isAr ? 'إدارة العروض المجمعة وحقائب الأدوات الطبية' : 'Manage grouped offers and medical tool kits'}
      </p>
    </div>
  );
}
