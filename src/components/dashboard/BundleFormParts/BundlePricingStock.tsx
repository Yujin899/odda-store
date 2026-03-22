'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BundleFormValues } from '@/lib/schemas';

interface BundlePricingStockProps {
  language: string;
  dict: any;
}

export function BundlePricingStock({ language, dict }: BundlePricingStockProps) {
  const { register, formState: { errors } } = useFormContext<BundleFormValues>();
  const isRtl = language === 'ar';

  return (
    <div className={bcn("bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6", isRtl ? "text-end" : "text-start")}>
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">
        {isRtl ? 'التسعير والمخزون' : 'Pricing & Inventory'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price (EGP)</Label>
          <Input type="number" {...register('price')} className="rounded-sm" />
          {errors.price && <p className="text-[10px] text-red-500 font-bold">{errors.price.message}</p>}
        </div>
        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {dict.dashboard.productForm.labels.originalPrice}
          </Label>
          <Input 
            type="number" 
            {...register('originalPrice')} 
            className="rounded-sm" 
            placeholder={dict.dashboard.productForm.placeholders.originalPrice}
          />
          {errors.originalPrice && <p className="text-[10px] text-red-500 font-bold">{errors.originalPrice.message}</p>}
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            {isRtl 
              ? "اختياري. إذا تم تحديده، سيظهر هذا السعر مشطوباً بجانب سعر البيع. اتركه فارغاً إذا لم يوجد خصم."
              : "Optional. If set, this price appears crossed out next to the sale price. Leave empty if there is no discount."
            }
          </p>
        </div>
      </div>

      <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock Quantity</Label>
        <Input type="number" {...register('stock')} className="rounded-sm font-bold" />
        {errors.stock && <p className="text-[10px] text-red-500 font-bold">{errors.stock.message}</p>}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description (EN)</Label>
          <Textarea {...register('description')} className="min-h-[100px] rounded-sm" />
          {errors.description && <p className="text-[10px] text-red-500 font-bold">{errors.description.message}</p>}
        </div>

        <div className={bcn("space-y-2", isRtl ? "text-end" : "text-start")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-cairo">الوصف (AR)</Label>
          <Textarea dir="rtl" {...register('descriptionAr')} className="min-h-[100px] rounded-sm font-cairo text-end" />
          {errors.descriptionAr && <p className="text-[10px] text-red-500 font-bold text-end">{errors.descriptionAr.message}</p>}
        </div>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
