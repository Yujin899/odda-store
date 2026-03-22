'use client';

import { useFormContext } from 'react-hook-form';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';
import { Product } from '@/types/store';

interface FormHeaderProps {
    initialData?: Product;
}

export function FormHeader({ initialData }: FormHeaderProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { 
    watch, 
  } = useFormContext<ProductFormValues>();

  const name = watch('name');
  const isRtl = language === 'ar';

  return (
    <div className={bcn("flex flex-col gap-1 mb-10 pb-6 border-b border-slate-200", isRtl ? "text-end" : "text-start")}>
      <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-navy">
        {initialData ? dict.dashboard.productForm.editTitle : dict.dashboard.productForm.newTitle}
      </h1>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
        {name || dict.dashboard.productForm.untitled}
      </p>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
