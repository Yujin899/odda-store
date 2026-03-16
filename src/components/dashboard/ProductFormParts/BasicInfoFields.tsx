'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';

export function BasicInfoFields() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { 
    register, 
    watch, 
    setValue, 
    formState: { errors, defaultValues } 
  } = useFormContext<ProductFormValues>();

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!defaultValues?.slug);
  
  const nameValue = watch('name');


  // Auto-Slug Logic
  useEffect(() => {
    if (!isSlugManuallyEdited && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, isSlugManuallyEdited, setValue]);

  return (
    <div className={bcn(
      "bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4",
      language === 'ar' ? 'text-end' : 'text-start'
    )}>
      <h3 className={bcn(
        "text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100",
        language === 'ar' ? 'text-end' : 'text-start'
      )}>
        {dict.dashboard.productForm.sections.basicInfo}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name (EN) */}
        <div className="space-y-2 text-start">
          <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.nameEn}
          </Label>
          <Input 
            id="name"
            {...register('name')}
            placeholder={dict.dashboard.productForm.placeholders.nameEn}
            className="rounded-sm border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10"
          />
          {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
        </div>

        {/* Name (AR) */}
        <div className="space-y-2 text-end">
          <Label htmlFor="nameAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">
            {dict.dashboard.productForm.labels.nameAr}
          </Label>
          <Input 
            id="nameAr"
            dir="rtl"
            {...register('nameAr')}
            placeholder={dict.dashboard.productForm.placeholders.nameAr}
            className="rounded-sm border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 text-end font-cairo"
          />
        </div>
      </div>

      {/* SEO Slug */}
      <div className="space-y-2 text-start">
        <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {dict.dashboard.productForm.labels.slug}
        </Label>
        <Input 
          id="slug"
          {...register('slug')}
          onChange={(e) => {
            setIsSlugManuallyEdited(true);
            const value = e.target.value.toLowerCase().replace(/[^\w-]+/g, '').replace(/ +/g, '-');
            setValue('slug', value);
          }}
          placeholder={dict.dashboard.productForm.placeholders.slug}
          className="rounded-sm font-mono text-xs border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10"
        />
        {errors.slug && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.slug.message}</p>}
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        {/* Description (EN) */}
        <div className="space-y-2 text-start">
          <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.descriptionEn}
          </Label>
          <Textarea 
            id="description"
            {...register('description')}
            placeholder={dict.dashboard.productForm.placeholders.descriptionEn}
            className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10"
          />
          {errors.description && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
        </div>

        {/* Description (AR) */}
        <div className="space-y-2 text-end">
          <Label htmlFor="descriptionAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">
            {dict.dashboard.productForm.labels.descriptionAr}
          </Label>
          <Textarea 
             id="descriptionAr"
             dir="rtl"
             {...register('descriptionAr')}
             placeholder={dict.dashboard.productForm.placeholders.descriptionAr}
             className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 text-end font-cairo"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function locally since it might be needed for class merging
function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
