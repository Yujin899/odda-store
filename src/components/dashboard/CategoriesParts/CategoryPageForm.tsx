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
      <div className="flex flex-col gap-1 mb-10 pb-6 border-b border-slate-200">
        <Link 
          href="/dashboard/categories" 
          className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-(--primary) transition-colors mb-2"
        >
          <ArrowLeft className={`size-3 ${language === 'ar' ? 'ms-1' : 'me-1'}`} />
          {dict.dashboard.categoriesPage.backToList || 'Back to categories'}
        </Link>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-(--navy)">
          {isEditing ? dict.dashboard.categoriesPage.modal.editTitle : dict.dashboard.categoriesPage.modal.newTitle}
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
          {dict.dashboard.categoriesPage.modal.description}
        </p>
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

      <div className="flex items-center gap-4 pt-8 border-t border-slate-200 mt-12 bg-white/50 p-6 rounded-none">
        <Button 
          asChild
          variant="outline" 
          className="flex-1 sm:flex-none font-bold uppercase tracking-widest text-[10px] h-12 px-8"
        >
          <Link href="/dashboard/categories">
            <ArrowLeft className={`size-4 ${language === 'ar' ? 'ms-2' : 'me-2'}`} />
            {dict.dashboard.categoriesPage.modal.cancel}
          </Link>
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 sm:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-12 px-10"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
          {isEditing ? dict.dashboard.categoriesPage.modal.update : dict.dashboard.categoriesPage.modal.create}
        </Button>
      </div>
    </div>
  );
}
