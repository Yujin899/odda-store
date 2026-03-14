'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BundleFormValues } from '@/lib/schemas';

interface BundleItemsSectionProps {
  language: string;
}

export function BundleItemsSection({ language }: BundleItemsSectionProps) {
  const { control, register } = useFormContext<BundleFormValues>();
  const isRtl = language === 'ar';

  const { fields: fieldsEn, append: appendEn, remove: removeEn } = useFieldArray({
    control,
    name: "bundleItems"
  } as any);

  const { fields: fieldsAr, append: appendAr, remove: removeAr } = useFieldArray({
    control,
    name: "bundleItemsAr"
  } as any);

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
      <h3 className={bcn("text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100", isRtl ? "text-end" : "text-start")}>
        {isRtl ? 'محتويات العرض' : 'Bundle Package Details'}
      </h3>

      <div className="space-y-6">
        {/* English Items */}
        <div className="space-y-4">
          <div className={bcn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "")}>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Items (EN)</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => appendEn('')} className="rounded-sm text-[9px] h-8">
              <Plus className="size-3 me-1" /> Add Item
            </Button>
          </div>
          {fieldsEn.map((field, idx) => (
            <div key={field.id} className={bcn("flex gap-2", isRtl ? "flex-row-reverse" : "")}>
              <Input {...register(`bundleItems.${idx}` as any)} className="rounded-sm h-9 text-xs" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeEn(idx)} className="text-red-500">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Arabic Items */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className={bcn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "flex-row")}>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">المحتويات (AR)</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => appendAr('')} className="rounded-sm text-[9px] h-8 font-cairo">
              <Plus className="size-3 me-1" /> إضافة منتج
            </Button>
          </div>
          {fieldsAr.map((field, idx) => (
            <div key={field.id} className={bcn("flex gap-2", isRtl ? "flex-row-reverse" : "")}>
              <Input dir="rtl" {...register(`bundleItemsAr.${idx}` as any)} className="rounded-sm h-9 text-xs text-end font-cairo" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeAr(idx)} className="text-red-500">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
