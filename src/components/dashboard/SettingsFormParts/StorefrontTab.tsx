'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Globe,
  Facebook,
  Instagram,
  Phone,
  Type,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { uploadImage } from '@/lib/upload';

export function StorefrontTab({ isUploading, setIsUploading }: { isUploading: boolean, setIsUploading: (v: boolean) => void }) {
  const { register, control, setValue, watch } = useFormContext();
  const { fields: announcements, append: addAnn, remove: removeAnn } = useFieldArray({ control, name: 'announcements' });
  const { fields: announcementsAr, append: addAnnAr, remove: removeAnnAr } = useFieldArray({ control, name: 'announcementsAr' });
  
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const { addToast } = useToastStore();

  const [uploadProgress, setUploadProgress] = useState(0);

  const heroImage = watch('hero.image');
  const defaultLang = watch('defaultLanguage');

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const data = await uploadImage(file, 'odda/hero');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setValue('hero.image', data.url);
        setIsUploading(false);
        setUploadProgress(0);
      }, 400);
    } catch (error: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      addToast({ 
        title: dict.dashboard.settingsPage.storefront.hero.uploadImage, 
        description: error.message || dict.toasts.errorUploading, 
        type: 'error' 
      });
    }
  };

  return (
    <div className="space-y-6 outline-none">
      {/* Announcements */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.storefront.announcements.titleEn}</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => addAnn('')} className="h-6 text-[8px] uppercase tracking-widest">
                <Plus className={`size-3 ${language === 'ar' ? 'ms-1' : 'me-1'}`} /> {dict.dashboard.settingsPage.storefront.announcements.addEn}
              </Button>
            </div>
            <div className="space-y-3">
              {announcements.map((field, idx) => (
                <div key={field.id} className="flex gap-2 text-start">
                  <div className="flex-1 relative">
                    <Input 
                      {...register(`announcements.${idx}` as const)}
                      placeholder={dict.dashboard.settingsPage.storefront.announcements.placeholderEn}
                      className="pe-16 rounded-sm text-sm"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeAnn(idx)}
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
              <Button type="button" variant="outline" size="sm" onClick={() => addAnnAr('')} className="h-6 text-[8px] uppercase tracking-widest">
                <Plus className={`size-3 ${language === 'ar' ? 'ms-1' : 'me-1'}`} /> {dict.dashboard.settingsPage.storefront.announcements.addAr}
              </Button>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.settingsPage.storefront.announcements.titleAr}</h3>
            </div>
            <div className="space-y-3">
              {announcementsAr.map((field, idx) => (
                <div key={field.id} className="flex gap-2 text-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeAnnAr(idx)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 size-10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Input 
                    {...register(`announcementsAr.${idx}` as const)}
                    dir="rtl"
                    placeholder={dict.dashboard.settingsPage.storefront.announcements.placeholderAr}
                    className="flex-1 rounded-sm text-sm text-end font-cairo"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {announcements.length === 0 && announcementsAr.length === 0 && (
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
            <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {dict.dashboard.settingsPage.storefront.hero.bgImage}
            </Label>
            <div className="relative group aspect-video rounded-sm overflow-hidden border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center transition-all hover:border-(--primary)/50">
              {heroImage ? (
                <>
                  <Image src={heroImage} alt="Hero Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="relative">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} disabled={isUploading} />
                        <Button type="button" variant="secondary" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                          <Upload className={`size-3 ${language === 'ar' ? 'ms-2' : 'me-2'}`} /> {dict.dashboard.settingsPage.storefront.hero.changeImage}
                        </Button>
                     </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10">
                  <ImageIcon className="size-10 text-slate-200" />
                  <div className="relative">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} disabled={isUploading} />
                    <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                      <Upload className={`size-3 ${language === 'ar' ? 'ms-2' : 'me-2'}`} /> {dict.dashboard.settingsPage.storefront.hero.uploadImage}
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
              <div className="space-y-2 text-start">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Type className="size-3" /> {dict.dashboard.settingsPage.storefront.hero.headingEn}
                </Label>
                <div className="relative">
                  <Input 
                    {...register('hero.heading')}
                    placeholder="Enter main heading"
                    className="pe-20 font-bold tracking-tight rounded-sm"
                  />
                </div>
              </div>
              <div className="space-y-2 text-end">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 justify-end">
                  {dict.dashboard.settingsPage.storefront.hero.headingAr} <Type className="size-3" />
                </Label>
                <Input 
                  {...register('hero.headingAr')}
                  dir="rtl"
                  placeholder="العنوان بالعربية"
                  className="font-bold tracking-tight rounded-sm text-end"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div className="space-y-2 text-start">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block text-start">{dict.dashboard.settingsPage.storefront.hero.btnTextEn}</Label>
                <Input 
                  {...register('hero.buttonText')}
                  placeholder="e.g. Shop Now"
                  className="rounded-sm"
                />
              </div>
              <div className="space-y-2 text-end">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block text-end">{dict.dashboard.settingsPage.storefront.hero.btnTextAr}</Label>
                <Input 
                  {...register('hero.buttonTextAr')}
                  dir="rtl"
                  placeholder="مثال: تسوق الآن"
                  className="rounded-sm text-end font-cairo"
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.settingsPage.storefront.hero.btnLink}</Label>
                <Input 
                  {...register('hero.buttonLink')}
                  placeholder="/products"
                  className="rounded-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-start gap-4">
              <div className={`size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ${language === 'ar' ? 'ms-4' : 'me-4'}`}>
                <Globe className="size-4" />
              </div>
              <div className={`space-y-1 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
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
              {...register('whatsappNumber')}
              placeholder="+20 123 456 7890"
              className="rounded-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Facebook className="size-3" /> {dict.dashboard.settingsPage.storefront.brand.facebook}
            </Label>
            <Input 
              {...register('socialLinks.facebook')}
              placeholder="https://facebook.com/oddastore"
              className="rounded-sm font-mono text-xs"
            />
          </div>

          <div className="space-y-2 md:col-start-2">
            <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Instagram className="size-3" /> {dict.dashboard.settingsPage.storefront.brand.instagram}
            </Label>
            <Input 
              {...register('socialLinks.instagram')}
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
              value={defaultLang}
              onValueChange={(value: 'en' | 'ar') => setValue('defaultLanguage', value)}
            >
              <SelectTrigger className="rounded-sm h-10 uppercase font-bold text-[10px] tracking-widest">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200">
                <SelectItem value="en" className="text-[10px] font-bold uppercase tracking-widest">English</SelectItem>
                <SelectItem value="ar" className="text-[10px] font-bold uppercase tracking-widest">العربية</SelectItem>
              </SelectContent>
            </Select>
            <p className={`text-[9px] text-slate-400 uppercase font-medium mt-1 ${language === 'ar' ? 'text-end' : ''}`}>
              {language === 'ar' ? 'اللغة التي تظهر للعملاء الجدد تلقائياً' : 'The language new customers see by default'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
