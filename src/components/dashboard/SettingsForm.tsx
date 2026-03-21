'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Save, 
  Loader2, 
  Globe,
  Wallet,
  Mail
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

import { StorefrontTab } from './SettingsFormParts/StorefrontTab';
import { CheckoutTab } from './SettingsFormParts/CheckoutTab';
import { EmailsTab } from './SettingsFormParts/EmailsTab';
import { ThemeTab } from './SettingsFormParts/ThemeTab';
import { defaultTheme } from '@/lib/theme';

const settingsSchema = z.object({
  announcements: z.array(z.string()),
  announcementsAr: z.array(z.string()),
  instapayNumber: z.string().min(1),
  shippingFee: z.number().min(0),
  whatsappNumber: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  }),
  hero: z.object({
    image: z.string().optional(),
    heading: z.string().min(1),
    headingAr: z.string().optional(),
    buttonText: z.string().min(1),
    buttonTextAr: z.string().optional(),
    buttonLink: z.string().min(1),
  }),
  confirmationSubjectEn: z.string().min(1),
  confirmationBodyEn: z.string().min(1),
  confirmationSubjectAr: z.string().min(1),
  confirmationBodyAr: z.string().min(1),
  shippedSubjectEn: z.string().min(1),
  shippedBodyEn: z.string().min(1),
  shippedSubjectAr: z.string().min(1),
  shippedBodyAr: z.string().min(1),
  defaultLanguage: z.enum(['en', 'ar']),
  theme: z.object({
    primary: z.string(),
    primaryForeground: z.string(),
    secondary: z.string(),
    secondaryForeground: z.string(),
    accent: z.string(),
    accentForeground: z.string(),
    background: z.string(),
    foreground: z.string(),
    border: z.string(),
    radius: z.string(),
    brandDark: z.string()
  }).optional()
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm({ initialData }: { initialData?: Partial<SettingsFormValues> }) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('storefront');

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      announcements: initialData?.announcements || [],
      announcementsAr: initialData?.announcementsAr || [],
      instapayNumber: initialData?.instapayNumber || '01126131495',
      shippingFee: initialData?.shippingFee || 0,
      whatsappNumber: initialData?.whatsappNumber || '',
      socialLinks: {
        facebook: initialData?.socialLinks?.facebook || '',
        instagram: initialData?.socialLinks?.instagram || '',
      },
      hero: {
        image: initialData?.hero?.image || '',
        heading: initialData?.hero?.heading || 'Browse premium instruments',
        headingAr: initialData?.hero?.headingAr || '',
        buttonText: initialData?.hero?.buttonText || 'Shop Now',
        buttonTextAr: initialData?.hero?.buttonTextAr || '',
        buttonLink: initialData?.hero?.buttonLink || '/products',
      },
      confirmationSubjectEn: initialData?.confirmationSubjectEn || "Odda - Order Confirmation #{{orderNumber}}",
      confirmationBodyEn: initialData?.confirmationBodyEn || "Hello {{customerName}},\n\nThank you for choosing Odda. Your order #{{orderNumber}} is confirmed and being processed.",
      confirmationSubjectAr: initialData?.confirmationSubjectAr || "عدة - تأكيد الطلب رقم {{orderNumber}}",
      confirmationBodyAr: initialData?.confirmationBodyAr || "مرحباً {{customerName}}،\n\nشكراً لثقتك في عدة. تم تأكيد طلبك رقم {{orderNumber}} وجاري تجهيزه.",
      shippedSubjectEn: initialData?.shippedSubjectEn || "Odda - Your Order #{{orderNumber}} has Shipped!",
      shippedBodyEn: initialData?.shippedBodyEn || "Great news {{customerName}}!\n\nYour order #{{orderNumber}} has been shipped and is on its way to you.",
      shippedSubjectAr: initialData?.shippedSubjectAr || "عدة - تم شحن طلبك رقم {{orderNumber}}!",
      shippedBodyAr: initialData?.shippedBodyAr || "أخبار رائعة {{customerName}}!\n\nتم شحن طلبك رقم {{orderNumber}} وهو الآن في طريقه إليك.",
      defaultLanguage: initialData?.defaultLanguage || 'en',
      theme: initialData?.theme || defaultTheme
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        addToast({ title: dict.dashboard.productForm.messages.success, description: dict.dashboard.settingsPage.messages.success, type: 'success' });
        router.refresh();
      } else {
        const result = await res.json();
        addToast({ title: dict.dashboard.productForm.messages.error, description: result.message || dict.dashboard.settingsPage.messages.error, type: 'error' });
      }
    } catch {
      addToast({ title: dict.dashboard.productForm.messages.error, description: dict.dashboard.settingsPage.messages.fatalError, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
          <div className={language === 'ar' ? 'text-end' : 'text-start'}>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">{dict.dashboard.settingsPage.title}</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dict.dashboard.settingsPage.subtitle}</p>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin ms-2" /> : <Save className="size-4 ms-2" />}
            {dict.dashboard.settingsPage.save}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-white border rounded-sm p-1 inline-flex w-max min-w-full">
              <TabsTrigger value="storefront" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
                <Globe className={`size-3 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
                {dict.dashboard.settingsPage.tabs.storefront}
              </TabsTrigger>
              <TabsTrigger value="checkout" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
                <Wallet className={`size-3 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
                {dict.dashboard.settingsPage.tabs.checkout}
              </TabsTrigger>
              <TabsTrigger value="emails" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
                <Mail className={`size-3 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
                {language === 'ar' ? 'قوالب البريد' : 'Email Templates'}
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
                {language === 'ar' ? 'المظهر' : 'Theme'}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="storefront" className="outline-none">
            <StorefrontTab />
          </TabsContent>

          <TabsContent value="checkout" className="outline-none">
            <CheckoutTab />
          </TabsContent>

          <TabsContent value="emails" className="outline-none">
            <EmailsTab />
          </TabsContent>

          <TabsContent value="theme" className="outline-none">
            <ThemeTab />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
