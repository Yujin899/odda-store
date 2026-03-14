'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Globe,
  Wallet,
  Truck,
  Instagram,
  Facebook,
  Phone,
  Type,
  Sparkles,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

export function SettingsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('storefront');

  // Form State
  const [formData, setFormData] = useState({
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
  });

  const [uploadProgress, setUploadProgress] = useState(0);


  const handleAnnouncementChange = (index: number, value: string, isAr: boolean = false) => {
    setFormData(prev => {
      if (isAr) {
        const newAnnAr = [...prev.announcementsAr];
        newAnnAr[index] = value;
        return { ...prev, announcementsAr: newAnnAr };
      }
      const newAnn = [...prev.announcements];
      newAnn[index] = value;
      return { ...prev, announcements: newAnn };
    });
  };

  const handleAddAnnouncement = (isAr: boolean = false) => {
    setFormData(prev => {
      if (isAr) {
        return { ...prev, announcementsAr: [...prev.announcementsAr, ''] };
      }
      return { ...prev, announcements: [...prev.announcements, ''] };
    });
  };

  const handleRemoveAnnouncement = (index: number, isAr: boolean = false) => {
    setFormData(prev => {
      if (isAr) {
        return { ...prev, announcementsAr: prev.announcementsAr.filter((_: any, i: number) => i !== index) };
      }
      return { ...prev, announcements: prev.announcements.filter((_: any, i: number) => i !== index) };
    });
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'odda/hero');

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      const data = await res.json();
      
      clearInterval(progressInterval);

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, image: data.url }
          }));
          setIsUploading(false);
          setUploadProgress(0);
        }, 400);
      } else {
        setIsUploading(false);
        addToast({ title: dict.toasts.uploadFailed, description: data.message || dict.dashboard.productForm.messages.saveFailed, type: 'error' });
      }
    } catch {
      clearInterval(progressInterval);
      setIsUploading(false);
      addToast({ title: dict.dashboard.settingsPage.storefront.hero.uploadImage, description: dict.toasts.errorUploading, type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        addToast({ title: dict.dashboard.productForm.messages.success, description: dict.dashboard.settingsPage.messages.success, type: 'success' });
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.dashboard.productForm.messages.error, description: data.message || dict.dashboard.settingsPage.messages.error, type: 'error' });
      }
    } catch {
      addToast({ title: dict.dashboard.productForm.messages.error, description: dict.dashboard.settingsPage.messages.fatalError, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">{dict.dashboard.settingsPage.title}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dict.dashboard.settingsPage.subtitle}</p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || isUploading}
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
              <Globe className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {dict.dashboard.settingsPage.tabs.storefront}
            </TabsTrigger>
            <TabsTrigger value="checkout" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
              <Wallet className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {dict.dashboard.settingsPage.tabs.checkout}
            </TabsTrigger>
            <TabsTrigger value="emails" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
              <Mail className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'قوالب البريد' : 'Email Templates'}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="storefront" className="space-y-6 outline-none">
          {/* Announcements */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.storefront.announcements.titleEn}</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddAnnouncement(false)} className="h-6 text-[8px] uppercase tracking-widest">
                    <Plus className={`size-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} /> {dict.dashboard.settingsPage.storefront.announcements.addEn}
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.announcements.map((text: string, idx: number) => (
                    <div key={idx} className="flex gap-2 text-left">
                      <div className="flex-1 relative">
                        <Input 
                          value={text} 
                          onChange={(e) => handleAnnouncementChange(idx, e.target.value, false)}
                          placeholder={dict.dashboard.settingsPage.storefront.announcements.placeholderEn}
                          className="pr-16 rounded-sm text-sm"
                        />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.storefront.announcements.titleEn}</h3>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveAnnouncement(idx, false)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 size-10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center justify-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddAnnouncement(true)} className="h-6 text-[8px] uppercase tracking-widest">
                    <Plus className={`size-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} /> {dict.dashboard.settingsPage.storefront.announcements.addAr}
                  </Button>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.storefront.announcements.titleAr}</h3>
                </div>
                <div className="space-y-3">
                  {formData.announcementsAr.map((text: string, idx: number) => (
                    <div key={idx} className="flex gap-2 text-right">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveAnnouncement(idx, true)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 size-10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <Input 
                        value={text} 
                        dir="rtl"
                        onChange={(e) => handleAnnouncementChange(idx, e.target.value, true)}
                        placeholder={dict.dashboard.settingsPage.storefront.announcements.placeholderAr}
                        className="flex-1 rounded-sm text-sm text-right font-cairo"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {formData.announcements.length === 0 && formData.announcementsAr.length === 0 && (
              <div className="py-8 text-center border-2 border-dashed rounded-sm border-slate-100 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                {dict.dashboard.settingsPage.storefront.announcements.empty}
              </div>
            )}
          </div>

          {/* Minimalist Hero Section Settings */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{dict.dashboard.settingsPage.storefront.hero.title}</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Hero Image Upload */}
              <div className="space-y-4">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {dict.dashboard.settingsPage.storefront.hero.bgImage}
                </Label>
                <div className="relative group aspect-video rounded-sm overflow-hidden border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center transition-all hover:border-(--primary)/50">
                  {formData.hero.image ? (
                    <>
                      <Image src={formData.hero.image} alt="Hero Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="relative">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} />
                            <Button type="button" variant="secondary" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                              <Upload className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} /> {dict.dashboard.settingsPage.storefront.hero.changeImage}
                            </Button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <ImageIcon className="size-10 text-slate-200" />
                      <div className="relative">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} />
                        <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                          <Upload className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} /> {dict.dashboard.settingsPage.storefront.hero.uploadImage}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                      <Loader2 className="size-8 text-(--primary) animate-spin mb-4" />
                      <Progress value={uploadProgress} className="h-1 w-full max-w-[200px] mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-(--primary)">{uploadProgress}% {dict.dashboard.settingsPage.storefront.hero.uploading}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Text Settings */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Type className="size-3" /> {dict.dashboard.settingsPage.storefront.hero.headingEn}
                    </Label>
                    <div className="relative">
                      <Input 
                        value={formData.hero.heading}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, heading: e.target.value } })}
                        placeholder="Enter main heading"
                        className="pr-20 font-bold tracking-tight rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 justify-end">
                      {dict.dashboard.settingsPage.storefront.hero.headingAr} <Type className="size-3" />
                    </Label>
                    <Input 
                      value={formData.hero.headingAr}
                      dir="rtl"
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, headingAr: e.target.value } })}
                      placeholder="العنوان بالعربية"
                      className="font-bold tracking-tight rounded-sm text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block text-left">{dict.dashboard.settingsPage.storefront.hero.btnTextEn}</Label>
                    <Input 
                      value={formData.hero.buttonText}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, buttonText: e.target.value } })}
                      placeholder="e.g. Shop Now"
                      className="rounded-sm"
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block text-right">{dict.dashboard.settingsPage.storefront.hero.btnTextAr}</Label>
                    <Input 
                      value={formData.hero.buttonTextAr}
                      dir="rtl"
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, buttonTextAr: e.target.value } })}
                      placeholder="مثال: تسوق الآن"
                      className="rounded-sm text-right font-cairo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.settingsPage.storefront.hero.btnLink}</Label>
                    <Input 
                      value={formData.hero.buttonLink}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, buttonLink: e.target.value } })}
                      placeholder="/products"
                      className="rounded-sm"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-start gap-4">
                  <div className={`size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}>
                    <Globe className="size-4" />
                  </div>
                  <div className={`space-y-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{dict.dashboard.settingsPage.storefront.hero.noticeTitle}</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">
                      {dict.dashboard.settingsPage.storefront.hero.noticeDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Brand Presence Section */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{dict.dashboard.settingsPage.storefront.brand.title}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Phone className="size-3" /> {dict.dashboard.settingsPage.storefront.brand.whatsapp}
                </Label>
                <Input 
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+20 123 456 7890"
                  className="rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Facebook className="size-3" /> {dict.dashboard.settingsPage.storefront.brand.facebook}
                </Label>
                <Input 
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                  })}
                  placeholder="https://facebook.com/oddastore"
                  className="rounded-sm font-mono text-xs"
                />
              </div>

              <div className="space-y-2 md:col-start-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Instagram className="size-3" /> {dict.dashboard.settingsPage.storefront.brand.instagram}
                </Label>
                <Input 
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value } 
                  })}
                  placeholder="https://instagram.com/oddastore"
                  className="rounded-sm font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* General Store Settings */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              {language === 'ar' ? 'الإعدادات العامة' : 'General Store Settings'}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Globe className="size-3" /> 
                  {language === 'ar' ? 'لغة المتجر الافتراضية' : 'Default Store Language'}
                </Label>
                <Select
                  value={formData.defaultLanguage}
                  onValueChange={(value: any) => setFormData({ ...formData, defaultLanguage: value })}
                >
                  <SelectTrigger className="rounded-sm h-10 uppercase font-bold text-[10px] tracking-widest">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-slate-200">
                    <SelectItem value="en" className="text-[10px] font-bold uppercase tracking-widest">English</SelectItem>
                    <SelectItem value="ar" className="text-[10px] font-bold uppercase tracking-widest">العربية</SelectItem>
                  </SelectContent>
                </Select>
                <p className={`text-[9px] text-slate-400 uppercase font-medium mt-1 ${language === 'ar' ? 'text-right' : ''}`}>
                  {language === 'ar' ? 'اللغة التي تظهر للعملاء الجدد تلقائياً' : 'The language new customers see by default'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-6 outline-none">
          <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className={`flex items-center gap-2 mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="size-4" />
                </div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.checkout.instapay.label}</Label>
              </div>
              <Input 
                value={formData.instapayNumber}
                onChange={(e) => setFormData({ ...formData, instapayNumber: e.target.value })}
                placeholder="01126131495"
                className={`h-12 text-lg font-black tracking-tighter ${language === 'ar' ? 'text-right' : ''}`}
              />
              <p className={`text-[9px] text-slate-400 uppercase font-medium ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.settingsPage.checkout.instapay.notice}</p>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center gap-2 mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="size-4" />
                </div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.checkout.shipping.label}</Label>
              </div>
              <Input 
                type="number"
                value={formData.shippingFee}
                onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                className={`h-12 text-lg font-black tracking-tighter ${language === 'ar' ? 'text-right [direction:ltr]' : ''}`}
              />
              <p className={`text-[9px] text-slate-400 uppercase font-medium ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.settingsPage.checkout.shipping.notice}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emails" className="space-y-6 outline-none">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {language === 'ar' ? 'قوالب البريد الإلكتروني' : 'Email Templates'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  {language === 'ar' ? 'تخصيص الرسائل التلقائية التي تصل للعملاء' : 'Customize the automatic emails sent to customers'}
                </p>
              </div>
            </div>

            {/* AI Assistant Panel for Emails */}
            <div className="bg-(--navy) text-white p-6 rounded-sm border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-left">
                  <div className="size-8 bg-(--primary) rounded-sm flex items-center justify-center shrink-0">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">🤖 Email Content Generator</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Professional SOTA Email Templates</p>
                  </div>
                </div>
                <Button 
                  type="button"
                  onClick={() => {
                    const prompt = `Act as a premium dental e-commerce expert. I need to generate professional transactional email templates for 'Order Confirmation' and 'Order Shipped'. Return ONLY a valid JSON object without markdown formatting, code blocks, or explanations. The JSON must contain exact keys: 'confirmationSubjectEn', 'confirmationBodyEn', 'confirmationSubjectAr', 'confirmationBodyAr', 'shippedSubjectEn', 'shippedBodyEn', 'shippedSubjectAr', 'shippedBodyAr'. Body content should be professional, welcoming, and use placeholders like {{customerName}} and {{orderNumber}}. For Arabic templates, use Egyptian Arabic with a premium, helpful tone.`;
                    navigator.clipboard.writeText(prompt);
                    addToast({ title: dict.toasts.promptCopied, description: dict.toasts.promptCopiedDesc, type: "success" });
                  }}
                  className="bg-white text-(--navy) hover:bg-white/90 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm border-none shadow-none"
                >
                  📝 {language === 'ar' ? 'نسخ المطالبة' : 'Copy AI Prompt'}
                </Button>
              </div>

              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  📥 {language === 'ar' ? 'الصق مخرجات AI هنا' : 'Paste AI JSON Output Here'}
                </Label>
                <Textarea 
                  placeholder='{ "confirmationSubjectEn": "...", "confirmationBodyEn": "...", ... }'
                  className="bg-white/5 border-white/10 text-white font-mono text-xs min-h-[100px] focus:border-(--primary) focus:ring-0 placeholder:text-white/20"
                  id="email-ai-json"
                />
                <Button 
                  type="button"
                  className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-sm"
                  onClick={() => {
                    const textarea = document.getElementById('email-ai-json') as HTMLTextAreaElement;
                    if (!textarea?.value) return;
                    
                    try {
                      let rawJson = textarea.value.trim();
                      if (rawJson.startsWith('```')) {
                        rawJson = rawJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
                      }

                      const data = JSON.parse(rawJson);
                      
                      setFormData(prev => ({
                        ...prev,
                        confirmationSubjectEn: data.confirmationSubjectEn || prev.confirmationSubjectEn,
                        confirmationBodyEn: data.confirmationBodyEn || prev.confirmationBodyEn,
                        confirmationSubjectAr: data.confirmationSubjectAr || prev.confirmationSubjectAr,
                        confirmationBodyAr: data.confirmationBodyAr || prev.confirmationBodyAr,
                        shippedSubjectEn: data.shippedSubjectEn || prev.shippedSubjectEn,
                        shippedBodyEn: data.shippedBodyEn || prev.shippedBodyEn,
                        shippedSubjectAr: data.shippedSubjectAr || prev.shippedSubjectAr,
                        shippedBodyAr: data.shippedBodyAr || prev.shippedBodyAr,
                      }));

                      addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.templatesUpdated, type: "success" });
                      textarea.value = '';
                    } catch (err) {
                      addToast({ title: dict.toasts.invalidJson, description: dict.toasts.invalidJsonDesc, type: "error" });
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
                          value={formData.confirmationSubjectEn}
                          onChange={(e) => setFormData({ ...formData, confirmationSubjectEn: e.target.value })}
                          placeholder="Odda - Order Confirmation #{{orderNumber}}"
                          className="rounded-sm text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Body</Label>
                        <textarea 
                          value={formData.confirmationBodyEn}
                          onChange={(e) => setFormData({ ...formData, confirmationBodyEn: e.target.value })}
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
                    <div className="space-y-4 text-right">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">عنوان الرسالة</Label>
                        <Input 
                          value={formData.confirmationSubjectAr}
                          dir="rtl"
                          onChange={(e) => setFormData({ ...formData, confirmationSubjectAr: e.target.value })}
                          className="rounded-sm text-sm text-right font-cairo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">نص الرسالة</Label>
                        <textarea 
                          value={formData.confirmationBodyAr}
                          dir="rtl"
                          onChange={(e) => setFormData({ ...formData, confirmationBodyAr: e.target.value })}
                          className="w-full min-h-[200px] p-4 text-sm bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all text-right font-cairo"
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
                          value={formData.shippedSubjectEn}
                          onChange={(e) => setFormData({ ...formData, shippedSubjectEn: e.target.value })}
                          placeholder="Odda - Your Order #{{orderNumber}} has Shipped!"
                          className="rounded-sm text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Body</Label>
                        <textarea 
                          value={formData.shippedBodyEn}
                          onChange={(e) => setFormData({ ...formData, shippedBodyEn: e.target.value })}
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
                    <div className="space-y-4 text-right">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">عنوان الرسالة</Label>
                        <Input 
                          value={formData.shippedSubjectAr}
                          dir="rtl"
                          onChange={(e) => setFormData({ ...formData, shippedSubjectAr: e.target.value })}
                          className="rounded-sm text-sm text-right font-cairo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 justify-end flex">نص الرسالة</Label>
                        <textarea 
                          value={formData.shippedBodyAr}
                          dir="rtl"
                          onChange={(e) => setFormData({ ...formData, shippedBodyAr: e.target.value })}
                          className="w-full min-h-[200px] p-4 text-sm bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all text-right font-cairo"
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
              <div className={`space-y-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
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
        </TabsContent>
      </Tabs>
    </form>
  );
}
