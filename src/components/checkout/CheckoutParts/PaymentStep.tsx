'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dictionary } from '@/types/store';
import { 
  WalletCards, 
  Truck, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  X,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CheckoutFormValues } from '@/lib/schemas';

interface PaymentStepProps {
  dict: Dictionary;
  instapayNumber: string;
}

export function PaymentStep({ dict, instapayNumber }: PaymentStepProps) {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  const { 
    register, 
    watch, 
    setValue,
    formState: { isSubmitting, errors } 
  } = useFormContext<CheckoutFormValues>();

  const paymentMethod = watch('paymentMethod');
  const proofUrl = watch('paymentProof');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local Preview (Fake progress for UI feel)
    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'payment_proofs');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadProgress(100);
        const data = await res.json();
        setValue('paymentProof', data.url, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Proof upload failed:', error);
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-[var(--radius)] border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-start">
        <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-1">
          {dict.checkoutPage.choosePayment}
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {dict.checkoutPage.paymentDesc || 'Secure your tools with your preferred method'}
        </p>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COD Option */}
        <label className={bcn(
          "relative flex flex-col items-center justify-center p-6 border-2 rounded-[var(--radius)] cursor-pointer transition-all duration-300",
          paymentMethod === 'cod' ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
        )}>
          <input 
            type="radio" 
            {...register('paymentMethod')} 
            value="cod" 
            className="sr-only" 
          />
          <Truck className={bcn("size-8 mb-4 stroke-[1.5px]", paymentMethod === 'cod' ? "text-primary" : "text-slate-300")} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
            {dict.checkoutPage.cod}
          </h3>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
            {dict.checkoutPage.codDesc}
          </p>
          {paymentMethod === 'cod' && <CheckCircle2 className="absolute top-2 inset-e-2 size-4 text-primary" />}
        </label>

        {/* InstaPay Option */}
        <label className={bcn(
          "relative flex flex-col items-center justify-center p-6 border-2 rounded-[var(--radius)] cursor-pointer transition-all duration-300",
          paymentMethod === 'instapay' ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-slate-100 hover:border-slate-200"
        )}>
          <input 
            type="radio" 
            {...register('paymentMethod')} 
            value="instapay" 
            className="sr-only" 
          />
          <Smartphone className={bcn("size-8 mb-4 stroke-[1.5px]", paymentMethod === 'instapay' ? "text-primary" : "text-slate-300")} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
            {dict.checkoutPage.instapay}
          </h3>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
            {dict.checkoutPage.instapayDesc}
          </p>
          {paymentMethod === 'instapay' && <CheckCircle2 className="absolute top-2 inset-e-2 size-4 text-primary" />}
        </label>
      </div>

      {/* InstaPay Upload Section */}
      {paymentMethod === 'instapay' && (
        <div className="bg-slate-50 p-6 rounded-[var(--radius)] border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className={bcn("flex items-start gap-4", isRtl ? "flex-row-reverse" : "flex-row")}>
            <div className="size-10 bg-white border border-slate-200 rounded-[var(--radius)] flex items-center justify-center shrink-0 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div className={bcn("flex-1", isRtl ? "text-end" : "text-start")}>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">
                {isRtl ? 'تحويل عبر إنستاباي' : 'Transfer via InstaPay'}
              </h4>
              <p className="text-[10px] font-mono font-bold text-primary select-all">
                {instapayNumber}
              </p>
            </div>
          </div>

          <div className="space-y-4">
             <div className={bcn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "flex-row")}>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  {dict.checkoutPage.uploadScreenshot}
                </span>
                {proofUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setValue('paymentProof', '')}
                    className="h-auto p-0 text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-transparent flex items-center gap-1 border-none"
                  >
                    <X className="size-3" /> {isRtl ? 'حذف' : 'Remove'}
                  </Button>
                )}
             </div>

             {proofUrl ? (
               <div className="relative aspect-video rounded-[var(--radius)] border border-slate-200 overflow-hidden bg-white group">
                 <Image 
                   src={proofUrl} 
                   alt="Proof" 
                   fill 
                   className="object-contain" 
                   unoptimized
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <CheckCircle2 className="size-8 text-white stroke-[2px]" />
                 </div>
               </div>
             ) : (
               <div className="relative">
                 <input 
                   type="file" 
                   onChange={handleFileUpload} 
                   accept="image/*" 
                   className="absolute inset-0 opacity-0 cursor-pointer z-10"
                   disabled={isUploading}
                 />
                 <div className={bcn(
                   "h-32 rounded-[var(--radius)] border-2 border-dashed flex flex-col items-center justify-center transition-all",
                   isUploading ? "bg-white border-primary/20" : "bg-white border-slate-200 hover:border-primary/30"
                 )}>
                   {isUploading ? (
                     <div className="flex flex-col items-center gap-2">
                        <Loader2 className="size-5 text-primary animate-spin" />
                        <Progress value={uploadProgress} className="w-24 h-1" />
                     </div>
                   ) : (
                     <div className="flex flex-col items-center text-center px-4">
                        <Upload className="size-5 text-slate-300 mb-2" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 px-4">
                          {dict.checkoutPage.uploadNote}
                        </span>
                     </div>
                   )}
                 </div>
               </div>
             )}
             {errors.paymentProof && (
               <p className={bcn("text-[9px] font-bold text-red-500 uppercase tracking-widest", isRtl ? "text-end" : "text-start")}>
                 {errors.paymentProof.message}
               </p>
             )}
          </div>
        </div>
      )}

      {/* Final Action Button */}
      <div className="pt-8 border-t border-slate-100">
         <Button 
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-[var(--radius)] uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all duration-300 active:scale-95 group relative overflow-hidden"
         >
           <span className="flex items-center justify-center gap-3 relative z-10">
             {isSubmitting ? (
               <>
                 <Loader2 className="size-5 animate-spin" />
                 {isRtl ? 'جاري تأكيد طلبك...' : 'Confirming Your Order...'}
               </>
             ) : (
               <>
                 <WalletCards className="size-5" />
                 {dict.checkoutPage.completeOrder}
               </>
             )}
           </span>
         </Button>
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4 leading-relaxed">
            {isRtl ? 'بإتمام هذا الطلب، فإنك توافق على شروط الخدمة الخاصة بنا.' : 'By completing this order, you agree to our Terms of Service.'}
         </p>
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
