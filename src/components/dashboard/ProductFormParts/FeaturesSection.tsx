'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '../ProductForm';

export function FeaturesSection() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { control, register } = useFormContext<ProductFormValues>();

  const { 
    fields: enFields, 
    append: appendEn, 
    remove: removeEn 
  } = useFieldArray({
    control,
    name: "features" as never // "features" is string[] in schema
  });

  const { 
    fields: arFields, 
    append: appendAr, 
    remove: removeAr 
  } = useFieldArray({
    control,
    name: "featuresAr" as never
  });

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
      <h3 className={bcn(
        "text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100",
        language === 'ar' ? 'text-end' : 'text-start'
      )}>
        {language === 'ar' ? 'مميزات المنتج' : 'Product Features'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* English Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Features (English)
            </Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendEn("")}
              className="rounded-sm text-[9px] uppercase tracking-widest h-8"
            >
              <Plus className="size-3 me-1" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {enFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input 
                  {...register(`features.${index}` as const)}
                  placeholder="e.g. Clinical Grade Stainless Steel"
                  className="rounded-sm border-slate-200 text-xs h-10"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeEn(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {enFields.length === 0 && (
              <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-8 border border-dashed rounded-sm">
                No features added yet
              </p>
            )}
          </div>
        </div>

        {/* Arabic Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-row-reverse">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">
              المميزات (بالعربية)
            </Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendAr("")}
              className="rounded-sm text-[9px] uppercase tracking-widest h-8 font-cairo"
            >
              <Plus className="size-3 ms-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {arFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 flex-row-reverse">
                <Input 
                  {...register(`featuresAr.${index}` as const)}
                  dir="rtl"
                  placeholder="مثال: ستانلس ستيل طبي عالي الجودة"
                  className="rounded-sm border-slate-200 text-xs text-end font-cairo h-10"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeAr(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {arFields.length === 0 && (
              <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-8 border border-dashed rounded-sm font-cairo">
                لم يتم إضافة مميزات بعد
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
