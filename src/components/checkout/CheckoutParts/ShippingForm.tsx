'use client';

import { useFormContext } from 'react-hook-form';
import { Dictionary } from '@/types/store';
import { User, Mail, Phone, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CheckoutFormValues } from '@/lib/schemas';

const EGYPT_CITIES = [
  "Cairo", "Alexandria", "Giza", "Suez", "Port Said", "Mansoura", 
  "Tanta", "Asyut", "Ismailia", "Fayoum", "Zagazig", "Aswan", 
  "Damietta", "Damanhur", "Minya", "Beni Suef", "Qena", "Sohag"
];

interface ShippingFormProps {
  dict: Dictionary;
  onNext: () => void;
  onBack: () => void;
}

export function ShippingForm({ dict, onNext, onBack }: ShippingFormProps) {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { 
    register, 
    formState: { errors } 
  } = useFormContext<CheckoutFormValues>();

  return (
    <div className="bg-white p-4 sm:p-10 rounded-[var(--radius)] border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={isRtl ? 'text-end' : 'text-start'}>
        <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-1">
          {dict.checkoutPage.shippingTitle || 'Shipping Details'}
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {dict.checkoutPage.shippingDesc || 'Where should we send your dental tools?'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          {...register('fullName')}
          label={dict.checkoutPage.fullName || 'Full Name'}
          placeholder={dict.checkoutPage.fullNamePlaceholder || 'e.g. Dr. Omar Ahmed'}
          icon={User}
          error={errors.fullName?.message}
          className={isRtl ? 'text-end' : 'text-start'}
        />

        <FormInput 
          {...register('email')}
          label={dict.checkoutPage.email || 'Email Address'}
          placeholder="doctor@example.com"
          icon={Mail}
          error={errors.email?.message}
          type="email"
          className={isRtl ? 'text-end' : 'text-start'}
        />

        <FormInput 
          {...register('phone')}
          label={dict.checkoutPage.phone || 'Phone Number'}
          placeholder="01xxxxxxxxx"
          icon={Phone}
          error={errors.phone?.message}
          className={isRtl ? 'text-end' : 'text-start'}
        />

        <div className="space-y-2 w-full">
          <label className={bcn("text-[10px] font-black uppercase tracking-widest text-muted-foreground ps-1 block", isRtl ? "text-end" : "text-start")}>
            {dict.checkoutPage.city || 'City / Governorate'}
          </label>
          <div className="relative group">
            <Building2 className="absolute inset-s-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors stroke-[2px]" />
            <select
              {...register('city')}
              className={bcn(
                "w-full h-14 bg-slate-50 border border-slate-100 rounded-[var(--radius)] text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all appearance-none ps-12 pe-10",
                errors.city ? "border-red-500" : "",
                isRtl ? "text-end direction-rtl" : "text-start"
              )}
            >
              {EGYPT_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          {errors.city && (
            <p className={bcn("text-[9px] font-bold text-red-500 uppercase tracking-widest ps-1", isRtl ? "text-end" : "text-start")}>
              {errors.city.message}
            </p>
          )}
        </div>
      </div>

      <FormInput 
        {...register('address')}
        label={dict.checkoutPage.address || 'Full Address'}
        placeholder={dict.checkoutPage.addressPlaceholder || 'e.g. 15 Clinic Street, 4th Floor'}
        icon={MapPin}
        error={errors.address?.message}
        className={isRtl ? 'text-end' : 'text-start'}
      />

      <div className={bcn(
        "flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100", 
        isRtl ? "sm:flex-row-reverse" : "sm:flex-row"
      )}>
        <Button 
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full sm:w-auto h-14 px-8 rounded-[var(--radius)] font-black uppercase tracking-widest text-[9px] text-slate-400 hover:text-primary"
        >
          {isRtl ? 'رجوع' : 'Go Back'}
        </Button>
        <Button 
          type="button"
          onClick={onNext}
          className="w-full sm:flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-[var(--radius)] uppercase tracking-[0.2em] text-[10px] shadow-xl group"
        >
          <span className="flex items-center gap-2">
            {dict.checkoutPage.proceedPayment || 'Next: Payment Method'}
            <ArrowRight className={bcn("size-4 transition-transform group-hover:translate-x-1", isRtl ? "rotate-180" : "")} />
          </span>
        </Button>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
