'use client';

import { useFormContext } from 'react-hook-form';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';
import { ImageUploader as SharedImageUploader } from '@/components/shared/ImageUploader';

export function ImageUploader() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { watch, setValue } = useFormContext<ProductFormValues>();

  const images = watch('images') || [];
  const isRtl = language === 'ar';

  return (
    <div id="images-section" className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      <h3 className={
        "text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 " +
        (isRtl ? "text-end" : "text-start")
      }>
        {dict.dashboard.productForm.sections.media}
      </h3>
      
      <SharedImageUploader 
        value={images}
        onChange={(newImages) => setValue('images', newImages, { shouldValidate: true, shouldDirty: true })}
        folder="odda/products"
        maxImages={5}
      />
    </div>
  );
}
