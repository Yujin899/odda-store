'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesTable } from './CategoriesParts/CategoriesTable';
import { DeleteCategoryDialog } from './CategoriesParts/DeleteCategoryDialog';
import { useCategories } from './CategoriesParts/useCategories';
import Link from 'next/link';

interface CategoriesClientProps {
  dict: any;
  language: string;
}

export function CategoriesClient({ dict, language }: CategoriesClientProps) {
  const {
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useCategories(dict);

  return (
    <div className="p-6 space-y-6 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-start">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-navy">
            {dict.dashboard.categoriesPage.title}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {dict.dashboard.categoriesPage.subtitle}
          </p>
        </div>
        <Button 
          asChild
          className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-primary/20 rounded-sm"
        >
          <Link href="/dashboard/categories/new">
            <Plus className="size-4 me-2" />
            {dict.dashboard.categoriesPage.addCategory}
          </Link>
        </Button>
      </div>

      <CategoriesTable 
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onDelete={setDeleteId}
        dict={dict}
        language={language}
      />

      <DeleteCategoryDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        dict={dict}
        language={language}
      />
    </div>
  );
}
