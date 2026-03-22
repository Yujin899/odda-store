'use client';

import { useFormContext } from 'react-hook-form';
import { DollarSign, Package, ShieldCheck } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { ProductFormValues } from '@/lib/schemas';

export function PricingFields() {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { register, formState: { errors } } = useFormContext<ProductFormValues>();

  const isRtl = language === 'ar';

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
      <h3 className={bcn(
        "text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100",
        isRtl ? "text-end" : "text-start"
      )}>
        {dict.dashboard.productForm.sections.pricing}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label={dict.dashboard.productForm.labels.price}
            type="number"
            icon={DollarSign}
            {...register('price')}
            error={errors.price?.message}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div>
            <FormInput 
              label={dict.dashboard.productForm.labels.originalPrice}
              type="number"
              icon={ShieldCheck}
              {...register('originalPrice')}
              error={errors.originalPrice?.message}
              placeholder={dict.dashboard.productForm.placeholders.originalPrice}
              min="0"
              step="0.01"
            />
            <p className={bcn(
              "text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-2 px-1",
              isRtl ? "text-end" : "text-start"
            )}>
              {isRtl 
                ? "اختياري. إذا تم تحديده، سيظهر هذا السعر مشطوباً بجانب سعر البيع. اتركه فارغاً إذا لم يوجد خصم."
                : "Optional. If set, this price appears crossed out next to the sale price. Leave empty if there is no discount."
              }
            </p>
          </div>

          <FormInput 
            label={dict.dashboard.productForm.labels.stock}
            type="number"
            icon={Package}
            {...register('stock')}
            error={errors.stock?.message}
            placeholder="0"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
