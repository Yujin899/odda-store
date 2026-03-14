'use client';

import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { BundleFormValues } from './BundleSchema';

interface BundleFormHeaderProps {
  initialData?: any;
  language: string;
  isLoading: boolean;
  isUploading: boolean;
  dict: any;
}

export function BundleFormHeader({ initialData, language, isLoading, isUploading, dict }: BundleFormHeaderProps) {
  const router = useRouter();
  const { watch } = useFormContext<BundleFormValues>();
  const name = watch('name');
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4">
      <div className={isRtl ? 'text-end' : 'text-start'}>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-(--navy)">
          {initialData ? (isRtl ? 'تعديل العرض' : 'Edit Bundle') : (isRtl ? 'عرض جديد' : 'New Bundle')}
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
          {name || (isRtl ? 'بدون عنوان' : 'Untitled')}
        </p>
      </div>
      <div className={bcn("flex items-center gap-2 sm:gap-3 w-full xs:w-auto", isRtl ? "flex-row-reverse" : "flex-row")}>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="flex-1 xs:flex-none rounded-sm font-bold uppercase tracking-widest text-[9px] h-10 px-4">
          {dict.common.cancel}
        </Button>
        <Button type="submit" disabled={isLoading || isUploading} className="flex-1 xs:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[9px] h-10 px-6 shadow-lg shadow-(--primary)/20 rounded-sm">
          {isLoading ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
          {initialData ? (isRtl ? 'تحديث' : 'Update') : (isRtl ? 'نشر' : 'Publish')}
        </Button>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
