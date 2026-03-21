'use client';

import { useFormContext } from 'react-hook-form';
import { Mail, Truck, Sparkles, Type } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSettingsAI } from './useSettingsAI';

export function EmailsTab() {
  const { register } = useFormContext();
  const { language } = useLanguageStore();
  const { handleCopyPrompt, handleMagicFill } = useSettingsAI();

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className={language === 'ar' ? 'text-end' : 'text-start'}>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {language === 'ar' ? 'قوالب البريد الإلكتروني' : 'Email Templates'}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {language === 'ar' ? 'تخصيص الرسائل التلقائية التي تصل للعملاء' : 'Customize the automatic emails sent to customers'}
          </p>
        </div>
      </div>

      {/* AI Assistant Panel for Emails */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-start">
            <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-navy">🤖 Email Content Generator</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Professional SOTA Email Templates</p>
            </div>
          </div>
          <Button 
            type="button"
            onClick={handleCopyPrompt}
            className="bg-navy text-white hover:bg-navy/90 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm border-none shadow-none"
          >
            📝 {language === 'ar' ? 'نسخ المطالبة' : 'Copy AI Prompt'}
          </Button>
        </div>

        <div className="space-y-2 text-start">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            📥 {language === 'ar' ? 'الصق مخرجات AI هنا' : 'Paste AI JSON Output Here'}
          </Label>
          <Textarea 
            placeholder='{ "confirmationSubjectEn": "...", "confirmationBodyEn": "...", ... }'
            className="bg-slate-50 border-slate-200 text-navy font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-slate-300"
            id="email-ai-json"
          />
          <Button 
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
            onClick={() => {
              const textarea = document.getElementById('email-ai-json') as HTMLTextAreaElement;
              if (handleMagicFill(textarea?.value)) {
                textarea.value = '';
              }
            }}
          >
            ✨ {language === 'ar' ? 'تعبئة سحرية للنموذج' : 'Magic Fill Templates'}
          </Button>
        </div>
      </div>

      {/* 1. Confirmation Email Section */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="size-8 rounded bg-(--primary)/5 text-(--primary) flex items-center justify-center">
              <Mail className="size-4" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tighter text-(--navy)">
              {language === 'ar' ? 'رسالة تأكيد الطلب' : 'Confirmation Email'}
            </h4>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase">EN</div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">English Template</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject Line</Label>
                  <Input 
                    {...register('confirmationSubjectEn')}
                    placeholder="Odda - Order Confirmation #{{orderNumber}}"
                    className="rounded-sm text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Body</Label>
                  <textarea 
                    {...register('confirmationBodyEn')}
                    className="w-full min-h-[200px] p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">القالب العربي</h4>
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase">AR</div>
              </div>
              <div className="space-y-4 text-end">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">عنوان الرسالة</Label>
                  <Input 
                    {...register('confirmationSubjectAr')}
                    dir="rtl"
                    className="rounded-sm text-sm text-end font-cairo"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">نص الرسالة</Label>
                  <textarea 
                    {...register('confirmationBodyAr')}
                    dir="rtl"
                    className="w-full min-h-[200px] p-4 text-sm bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all text-end font-cairo"
                  />
                </div>
              </div>
            </div>
         </div>
      </div>

      {/* 2. Shipped Email Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
         <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="size-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="size-4" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tighter text-(--navy)">
              {language === 'ar' ? 'رسالة تم الشحن' : 'Shipped Email'}
            </h4>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase">EN</div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">English Template</h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject Line</Label>
                  <Input 
                    {...register('shippedSubjectEn')}
                    placeholder="Odda - Your Order #{{orderNumber}} has Shipped!"
                    className="rounded-sm text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Body</Label>
                  <textarea 
                    {...register('shippedBodyEn')}
                    className="w-full min-h-[200px] p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">القالب العربي</h4>
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase">AR</div>
              </div>
              <div className="space-y-4 text-end">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">عنوان الرسالة</Label>
                  <Input 
                    {...register('shippedSubjectAr')}
                    dir="rtl"
                    className="rounded-sm text-sm text-end font-cairo"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">نص الرسالة</Label>
                  <textarea 
                    {...register('shippedBodyAr')}
                    dir="rtl"
                    className="w-full min-h-[200px] p-4 text-sm bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all text-end font-cairo"
                  />
                </div>
              </div>
            </div>
         </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-sm border border-amber-100 flex items-start gap-4">
        <div className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Type className="size-4" />
        </div>
        <div className={`space-y-1 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">
            {language === 'ar' ? 'تنبيه بخصوص المتغيرات' : 'Placeholder Tip'}
          </p>
          <p className="text-[9px] text-amber-700 font-medium leading-relaxed uppercase">
            {language === 'ar' 
              ? 'استخدم {{customerName}} لاسم العميل و {{orderNumber}} لرقم الطلب. سيتم استبدالها تلقائياً عند الإرسال.' 
              : 'Use {{customerName}} for the customer name and {{orderNumber}} for the order ID. They will be replaced automatically.'}
          </p>
        </div>
      </div>
    </div>
  );
}
