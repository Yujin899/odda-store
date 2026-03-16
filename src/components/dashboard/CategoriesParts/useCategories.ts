'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToastStore } from '@/store/useToastStore';

import { uploadImage } from '@/lib/upload';

interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

export function useCategories(dict: any, language: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    image: ''
  });

  const { addToast } = useToastStore();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.somethingWentWrong, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, dict.toasts.error, dict.toasts.somethingWentWrong]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameAr: category.nameAr || '',
        slug: category.slug,
        description: category.description || '',
        descriptionAr: category.descriptionAr || '',
        image: category.image || ''
      });
      setIsSlugManuallyEdited(true);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        nameAr: '',
        slug: '',
        description: '',
        descriptionAr: '',
        image: ''
      });
      setIsSlugManuallyEdited(false);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => (prev >= 95 ? 95 : prev + 5));
    }, 100);

    try {
      const uploadData = await uploadImage(file, 'odda/categories');
      setUploadProgress(100);
      setTimeout(() => {
        setFormData(prev => ({ ...prev, image: uploadData.url }));
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      addToast({ title: dict.toasts.success, description: language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully', type: 'success' });
    } catch (error: any) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      addToast({ title: dict.toasts.error, description: error.message || dict.toasts.uploadFailed, type: 'error' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.categorySaved, type: 'success' });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.categoryFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMagicFill = async () => {
    if (!formData.name) {
      addToast({ title: language === 'ar' ? 'الاسم مطلوب' : 'Name Required', description: language === 'ar' ? 'يرجى إدخال اسم القسم أولاً لاستخدام الملء التلقائي.' : 'Please enter a category name first to use Auto Translate & SEO.', type: 'info' });
      return;
    }
    setIsMagicFilling(true);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'category', payload: { name: formData.name, description: formData.description } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content');
      setFormData(prev => ({ ...prev, nameAr: data.nameAr || prev.nameAr, description: data.description || prev.description, descriptionAr: data.descriptionAr || prev.descriptionAr, slug: data.slug || prev.slug }));
      addToast({ title: dict.toasts.magicFillComplete, description: dict.toasts.magicFillDesc, type: 'success' });
    } catch (error: any) {
      addToast({ title: dict.toasts.error, description: error.message || dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.categoryDeleted, type: 'success' });
        fetchCategories();
      } else {
        const data = await res.json();
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.categoryDeleteFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  return {
    categories,
    isLoading,
    isSaving,
    isUploading,
    searchQuery,
    setSearchQuery,
    deleteId,
    setDeleteId,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    formData,
    setFormData,
    isSlugManuallyEdited,
    setIsSlugManuallyEdited,
    isMagicFilling,
    uploadProgress,
    handleImageUpload,
    handleSave,
    handleMagicFill,
    handleDelete,
    openModal,
    addToast
  };
}
