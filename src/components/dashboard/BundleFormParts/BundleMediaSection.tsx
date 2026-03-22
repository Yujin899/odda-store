'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { BundleFormValues } from '@/lib/schemas';
import { ImageUploader } from '@/components/shared/ImageUploader';

interface BundleMediaSectionProps {
  language: string;
  dict: any;
}

export function BundleMediaSection({ language, dict }: BundleMediaSectionProps) {
  const { watch, setValue } = useFormContext<BundleFormValues>();
  const images = watch('images') || [];
  const isRtl = language === 'ar';

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100 text-start">
        {isRtl ? 'الصور والوسائط' : 'Media Library'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-row">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Images ({images.length})</Label>
        </div>

        <ImageUploader 
          value={images.map((url: string, i: number) => ({ url, isPrimary: i === 0, order: i }))}
          onChange={(newImages) => setValue('images', newImages.map(img => img.url), { shouldValidate: true, shouldDirty: true })}
          folder="odda/products"
          maxImages={5}
        />
      </div>
    </div>
  );
}
