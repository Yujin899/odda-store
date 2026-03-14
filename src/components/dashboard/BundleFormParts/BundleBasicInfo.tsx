'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BundleFormValues } from './BundleSchema';

interface BundleBasicInfoProps {
  dict: any;
  language: string;
}

export function BundleBasicInfo({ dict, language }: BundleBasicInfoProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<BundleFormValues>();
  const isRtl = language === 'ar';

  return (
    <div className={bcn("bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4", isRtl ? "text-end" : "text-start")}>
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">
        {dict.dashboard.productForm.sections.basicInfo}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.nameEn}</Label>
          <Input 
            id="name"
            {...register('name')}
            onChange={(e) => {
              const name = e.target.value;
              setValue('name', name);
              // Auto-generate slug if not manually edited? 
              // For now simpler to just register it
              setValue('slug', name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
            }}
            className="rounded-sm border-slate-200"
          />
          {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
        </div>

        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label htmlFor="nameAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">{dict.dashboard.productForm.labels.nameAr}</Label>
          <Input 
            id="nameAr" dir="rtl"
            {...register('nameAr')}
            className="rounded-sm border-slate-200 text-end font-cairo"
          />
        </div>
      </div>

      <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
        <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.productForm.labels.slug}</Label>
        <Input 
          id="slug"
          {...register('slug')}
          className="rounded-sm font-mono text-xs"
        />
        {errors.slug && <p className="text-[10px] text-red-500 font-bold">{errors.slug.message}</p>}
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
