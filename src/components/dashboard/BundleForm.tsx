'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { IBundle } from '@/models/Bundle';
import { useBundleUpload } from '@/hooks/useBundleUpload';

import { bundleSchema, BundleFormValues } from '@/lib/schemas';
import { BundleFormHeader } from './BundleFormParts/BundleFormHeader';
import { BundleAIAssistant } from './BundleFormParts/BundleAIAssistant';
import { BundleBasicInfo } from './BundleFormParts/BundleBasicInfo';
import { BundleItemsSection } from './BundleFormParts/BundleItemsSection';
import { BundlePricingStock } from './BundleFormParts/BundlePricingStock';
import { BundleMediaSection } from './BundleFormParts/BundleMediaSection';

interface BundleFormProps {
  initialData?: IBundle;
}

export function BundleForm({ initialData }: BundleFormProps) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      nameAr: initialData?.nameAr || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      descriptionAr: initialData?.descriptionAr || '',
      price: initialData?.price || 0,
      compareAtPrice: initialData?.compareAtPrice || 0,
      stock: initialData?.stock || 0,
      bundleItems: initialData?.bundleItems || [''],
      bundleItemsAr: initialData?.bundleItemsAr || [''],
      images: initialData?.images || [],
    }
  });

  const { isUploading, uploadingFiles, handleImageUpload, removeImage, onDragEnd } = useBundleUpload();

  const onSubmit = async (values: BundleFormValues) => {
    setIsLoading(true);
    try {
      const url = initialData ? `/api/bundles/${initialData.slug}` : '/api/bundles';
      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          bundleItems: values.bundleItems.filter(Boolean),
          bundleItemsAr: values.bundleItemsAr?.filter(Boolean) || [],
        })
      });

      if (res.ok) {
        addToast({ title: dict.toasts.success, description: language === 'ar' ? 'تم حفظ العرض بنجاح' : 'Bundle saved successfully', type: 'success' });
        router.push('/dashboard/bundles');
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-20">
        <BundleFormHeader initialData={initialData} language={language} isLoading={isLoading} isUploading={isUploading} dict={dict} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-3"><BundleAIAssistant language={language} dict={dict} /></div>
          <div className="lg:col-span-2 space-y-6">
            <BundleBasicInfo dict={dict} language={language} />
            <BundleItemsSection language={language} />
            <BundlePricingStock language={language} />
          </div>
          <div className="lg:col-span-1">
            <BundleMediaSection language={language} isUploading={isUploading} uploadingFiles={uploadingFiles} handleImageUpload={handleImageUpload} removeImage={removeImage} onDragEnd={onDragEnd} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
