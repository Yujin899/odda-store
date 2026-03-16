'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesTable } from './CategoriesParts/CategoriesTable';
import { CategoryDialog } from './CategoriesParts/CategoryDialog';
import { DeleteCategoryDialog } from './CategoriesParts/DeleteCategoryDialog';
import { useCategories } from './CategoriesParts/useCategories';

interface CategoriesClientProps {
  dict: any;
  language: string;
}

export function CategoriesClient({ dict, language }: CategoriesClientProps) {
  const {
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
  } = useCategories(dict, language);

  return (
    <div className="p-6 space-y-6 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-start">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">
            {dict.dashboard.categoriesPage.title}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {dict.dashboard.categoriesPage.subtitle}
          </p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          <Plus className="size-4 me-2" />
          {dict.dashboard.categoriesPage.addCategory}
        </Button>
      </div>

      <CategoriesTable 
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onEdit={openModal}
        onDelete={setDeleteId}
        dict={dict}
        language={language}
      />

      <CategoryDialog 
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onSave={handleSave}
        editingCategory={editingCategory}
        isSaving={isSaving}
        formData={formData}
        setFormData={setFormData}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        handleImageUpload={handleImageUpload}
        handleMagicFill={handleMagicFill}
        isMagicFilling={isMagicFilling}
        isSlugManuallyEdited={isSlugManuallyEdited}
        setIsSlugManuallyEdited={setIsSlugManuallyEdited}
        dict={dict}
        language={language}
        addToast={addToast}
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
