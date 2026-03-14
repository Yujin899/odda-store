import React from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { CheckoutFormData } from './CheckoutTypes';

interface ShippingFormProps {
  dict: any;
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  dict,
  formData,
  setFormData,
  handleNext,
  handleBack,
}) => {
  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl p-8 space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8">{dict.checkoutPage.shippingInfo}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label={dict.checkoutPage.fullName}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Dr. Ahmed Ali"
          />
          <FormInput
            label={dict.checkoutPage.phone}
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+20 123 456 7890"
          />
          <div className="md:col-span-2">
            <FormInput
              label={dict.checkoutPage.address}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Campus, Lab Building, 3rd Floor"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              label={dict.checkoutPage.email}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmed.ali@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ps-1 block">
              {dict.checkoutPage.city}
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all cursor-pointer appearance-none"
            >
              <option>Cairo</option>
              <option>Giza</option>
              <option>Alexandria</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={handleBack} 
          className="w-32 h-16 bg-white border border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) hover:bg-slate-50 transition-all cursor-pointer outline-none"
        >
          {dict.checkoutPage.back}
        </button>
        <button 
          onClick={handleNext} 
          className="flex-1 h-16 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95 cursor-pointer outline-none border-none"
        >
          {dict.checkoutPage.nextPayment}
        </button>
      </div>
    </motion.div>
  );
};
