'use client';

import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryForm } from './CategoryForm';
import { useCategoryForm } from './useCategoryForm';
import Link from 'next/link';

interface Category {
  _id?: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  image: string;
}

interface CategoryPageFormProps {
  initialData?: Category;
  dict: any;
  language: string;
}

export function CategoryPageForm({ initialData, dict, language }: CategoryPageFormProps) {
  const {
    formData,
    setFormData,
    isSaving,
    isMagicFilling,
    isSlugManuallyEdited,
    setIsSlugManuallyEdited,
    handleMagicFill,
    handleSave,
    addToast
  } = useCategoryForm(dict, language, initialData);

  const isEditing = !!initialData?._id;

  return (
    <div className="space-y-6 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link 
            href="/dashboard/categories" 
            className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-(--primary) transition-colors mb-2"
          >
            <ArrowLeft className={`size-3 ${language === 'ar' ? 'ms-1' : 'me-1'}`} />
            {dict.dashboard.categoriesPage.backToList || 'Back to categories'}
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">
            {isEditing ? dict.dashboard.categoriesPage.modal.editTitle : dict.dashboard.categoriesPage.modal.newTitle}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {dict.dashboard.categoriesPage.modal.description}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            asChild
            variant="outline" 
            className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-11 px-6 border-slate-200"
          >
            <Link href="/dashboard/categories">
              {dict.dashboard.categoriesPage.modal.cancel}
            </Link>
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
            {isEditing ? dict.dashboard.categoriesPage.modal.update : dict.dashboard.categoriesPage.modal.create}
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
        <CategoryForm 
          formData={formData}
          setFormData={setFormData}
          handleMagicFill={handleMagicFill}
          isMagicFilling={isMagicFilling}
          isSlugManuallyEdited={isSlugManuallyEdited}
          setIsSlugManuallyEdited={setIsSlugManuallyEdited}
          dict={dict}
          language={language}
          addToast={addToast}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button 
          asChild
          variant="outline" 
          className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-11 px-6 border-slate-200"
        >
          <Link href="/dashboard/categories">
            {dict.dashboard.categoriesPage.modal.cancel}
          </Link>
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
          {isEditing ? dict.dashboard.categoriesPage.modal.update : dict.dashboard.categoriesPage.modal.create}
        </Button>
      </div>
    </div>
  );
}
