'use client';


import { useState, useEffect, useCallback } from 'react';
import { useToastStore } from '@/store/useToastStore';

interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

export function useCategories(dict: { [key: string]: any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    searchQuery,
    setSearchQuery,
    deleteId,
    setDeleteId,
    handleDelete,
    addToast
  };
}
