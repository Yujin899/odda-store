'use client';

import { useRouter } from 'next/navigation';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { productSchema, ProductFormValues } from '@/lib/schemas';
import { Product } from '@/types/store';

// Form Parts
import { FormHeader } from './ProductFormParts/FormHeader';
import { AIAssistant } from './ProductFormParts/AIAssistant';
import { BasicInfoFields } from './ProductFormParts/BasicInfoFields';
import { ImageUploader } from './ProductFormParts/ImageUploader';
import { FeaturesSection } from './ProductFormParts/FeaturesSection';
import { PricingFields } from './ProductFormParts/PricingFields';
import { OrganizationFields } from './ProductFormParts/OrganizationFields';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  /**
   * Initialize React Hook Form with Zod Resolver
   */
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      nameAr: initialData?.nameAr || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      descriptionAr: initialData?.descriptionAr || '',
      price: Number(initialData?.price) || 0,
      originalPrice: initialData?.originalPrice || '',
      categoryId: typeof initialData?.categoryId === 'object' ? initialData.categoryId?._id : (initialData?.categoryId || ''),
      badgeId: typeof initialData?.badgeId === 'object' ? initialData.badgeId?._id : (initialData?.badgeId || null),
      stock: Number(initialData?.stock) || 0,
      featured: !!initialData?.featured,
      features: initialData?.features || [],
      featuresAr: initialData?.featuresAr || [],
      images: initialData?.images || [],
    },
  });

  /**
   * Final Form Submission Logic
   */
  const onSubmit = async (values: ProductFormValues) => {
    try {
      const url = initialData ? `/api/products/${initialData.slug}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ 
          title: dict.dashboard.productForm.messages.success, 
          description: dict.dashboard.productForm.messages.productSaved, 
          type: 'success' 
        });
        router.push('/dashboard/products');
        router.refresh();
      } else {
        addToast({ 
          title: dict.dashboard.productForm.messages.error, 
          description: data.message || dict.dashboard.productForm.messages.saveFailed, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      addToast({ 
        title: dict.dashboard.productForm.messages.error, 
        description: dict.dashboard.productForm.messages.fatalError, 
        type: 'error' 
      });
    }
  };

  /**
   * Handle Validation Errors
   */
  const onError = (errors: FieldErrors<ProductFormValues>) => {
    if (errors.images) {
      addToast({ 
        title: dict.dashboard.productForm.messages.error, 
        description: 'Please add at least one product image before saving', 
        type: 'error' 
      });
      document.getElementById('images-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      addToast({ 
        title: dict.dashboard.productForm.messages.error, 
        description: 'Please fill in all required fields correctly', 
        type: 'error' 
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={methods.handleSubmit(onSubmit, onError)} 
        className="space-y-6 sm:space-y-10 max-w-6xl mx-auto pb-24"
      >
        {/* Sticky Header */}
        <FormHeader initialData={initialData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Magic Fill Panel */}
            <AIAssistant />

            {/* Core Info */}
            <BasicInfoFields />

            {/* Media Uploads */}
            <ImageUploader />

            {/* Dynamic Features */}
            <FeaturesSection />
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-8 sticky top-24">
            {/* Inventory & Pricing */}
            <PricingFields />

            {/* Categorization & Visibility */}
            <OrganizationFields />
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center gap-4 pt-8 border-t border-slate-200 mt-12 bg-white/50 p-6 rounded-none">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={methods.formState.isSubmitting}
            className="flex-1 sm:flex-none font-bold uppercase tracking-widest text-[10px] h-12 px-8"
          >
            <X className={`size-4 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
            {dict.dashboard.productForm.cancel}
          </Button>
          <Button 
            type="submit" 
            disabled={methods.formState.isSubmitting}
            className="flex-1 sm:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-12 px-10"
          >
            {methods.formState.isSubmitting ? (
              <Loader2 className={`size-4 animate-spin ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
            ) : (
              <Check className={`size-4 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
            )}
            {initialData ? dict.dashboard.productForm.update : dict.dashboard.productForm.publish}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
