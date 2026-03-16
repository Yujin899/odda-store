'use client';

import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryForm } from './CategoryForm';

interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  editingCategory: Category | null;
  isSaving: boolean;
  formData: any;
  setFormData: (data: any) => void;
  isUploading: boolean;
  uploadProgress: number;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMagicFill: () => void;
  isMagicFilling: boolean;
  isSlugManuallyEdited: boolean;
  setIsSlugManuallyEdited: (val: boolean) => void;
  dict: any;
  language: string;
  addToast: (toast: any) => void;
}

export function CategoryDialog({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  isSaving,
  formData,
  setFormData,
  isUploading,
  uploadProgress,
  handleImageUpload,
  handleMagicFill,
  isMagicFilling,
  isSlugManuallyEdited,
  setIsSlugManuallyEdited,
  dict,
  language,
  addToast
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-sm pt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <form onSubmit={onSave}>
          <DialogHeader className={language === 'ar' ? 'text-end' : ''}>
            <DialogTitle className="font-black uppercase tracking-tighter text-xl">
              {editingCategory ? dict.dashboard.categoriesPage.modal.editTitle : dict.dashboard.categoriesPage.modal.newTitle}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {dict.dashboard.categoriesPage.modal.description}
            </DialogDescription>
          </DialogHeader>

          <CategoryForm 
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

          <DialogFooter className={`gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onClose(false)}
              className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200"
            >
              {dict.dashboard.categoriesPage.modal.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || isUploading}
              className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
              {editingCategory ? dict.dashboard.categoriesPage.modal.update : dict.dashboard.categoriesPage.modal.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
