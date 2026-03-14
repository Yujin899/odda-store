'use client';

import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '../ProductForm';

interface FormHeaderProps {
    initialData?: any;
    isUploading?: boolean;
}

export function FormHeader({ initialData, isUploading }: FormHeaderProps) {
  const router = useRouter();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { 
    watch, 
    formState: { isSubmitting } 
  } = useFormContext<ProductFormValues>();

  const name = watch('name');
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-50 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4">
      <div className={isRtl ? 'text-end' : 'text-start'}>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-(--navy)">
          {initialData ? dict.dashboard.productForm.editTitle : dict.dashboard.productForm.newTitle}
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
          {name || dict.dashboard.productForm.untitled}
        </p>
      </div>
      
      <div className={bcn("flex items-center gap-2 sm:gap-3 w-full xs:w-auto", isRtl ? "flex-row-reverse" : "flex-row")}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 xs:flex-none rounded-sm font-bold uppercase tracking-widest text-[9px] h-10 px-4 sm:px-6 bg-white"
        >
          <X className={bcn("size-3", isRtl ? "ms-2" : "me-2")} />
          {dict.dashboard.productForm.cancel}
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isUploading}
          className="flex-1 xs:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[9px] h-10 px-6 sm:px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          {isSubmitting ? (
            <Loader2 className={bcn("size-4 animate-spin", isRtl ? "ms-2" : "me-2")} />
          ) : (
            <Check className={bcn("size-4", isRtl ? "ms-2" : "me-2")} />
          )}
          {initialData ? dict.dashboard.productForm.update : dict.dashboard.productForm.publish}
        </Button>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
