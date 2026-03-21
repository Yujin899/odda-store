'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/store/useToastStore';

interface Category {
  _id?: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  image: string;
}

export function useCategoryForm(dict: any, language: string, initialData?: Category) {
  const router = useRouter();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState<Category>(initialData || {
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    image: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData);

  const handleMagicFill = async () => {
    if (!formData.name) {
      addToast({ 
        title: language === 'ar' ? 'الاسم مطلوب' : 'Name Required', 
        description: language === 'ar' ? 'يرجى إدخال اسم القسم أولاً لاستخدام الملء التلقائي.' : 'Please enter a category name first to use Auto Translate & SEO.', 
        type: 'info' 
      });
      return;
    }
    setIsMagicFilling(true);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          entityType: 'category', 
          payload: { name: formData.name, description: formData.description } 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content');
      
      setFormData(prev => ({ 
        ...prev, 
        nameAr: data.nameAr || prev.nameAr, 
        description: data.description || prev.description, 
        descriptionAr: data.descriptionAr || prev.descriptionAr, 
        slug: data.slug || prev.slug 
      }));
      addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.magicFillDesc, type: 'success' });
    } catch (error: any) {
      addToast({ title: dict.toasts.error, description: error.message || dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = initialData?._id ? `/api/categories/${initialData._id}` : '/api/categories';
      const method = initialData?._id ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.categorySaved, type: 'success' });
        router.push('/dashboard/categories');
        router.refresh();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.categoryFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    isSaving,
    isMagicFilling,
    isSlugManuallyEdited,
    setIsSlugManuallyEdited,
    handleMagicFill,
    handleSave,
    addToast
  };
}
