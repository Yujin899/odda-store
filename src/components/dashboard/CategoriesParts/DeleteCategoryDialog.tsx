'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dict: any;
  language: string;
}

export function DeleteCategoryDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  dict, 
  language 
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle className="font-black uppercase tracking-tighter">
            {dict.dashboard.categoriesPage.deleteDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium">
            {dict.dashboard.categoriesPage.deleteDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
            {dict.dashboard.categoriesPage.deleteDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold uppercase tracking-widest text-[10px]"
          >
            {dict.dashboard.categoriesPage.deleteDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
