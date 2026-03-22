'use client';

import { useFormContext } from 'react-hook-form';
import { Phone, Truck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

export function CheckoutTab() {
  const { register } = useFormContext();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm grid md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Phone className="size-4" />
          </div>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.checkout.instapay.label}</Label>
        </div>
        <Input 
          {...register('instapayNumber')}
          placeholder="01126131495"
          className="h-12 text-lg font-black tracking-tighter text-start"
        />
        <p className="text-[9px] text-slate-400 uppercase font-medium text-start">{dict.dashboard.settingsPage.checkout.instapay.notice}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="size-4" />
          </div>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.checkout.shipping.label}</Label>
        </div>
        <Input 
          type="number"
          {...register('shippingFee', { valueAsNumber: true })}
          className={`h-12 text-lg font-black tracking-tighter ${language === 'ar' ? '[direction:ltr]' : ''}`}
        />
        <p className="text-[9px] text-slate-400 uppercase font-medium text-start">{dict.dashboard.settingsPage.checkout.shipping.notice}</p>
      </div>
    </div>
  );
}
