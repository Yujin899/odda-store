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
import { Loader2 } from 'lucide-react';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  dict: any;
  language: string;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  dict,
  language,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={isOpen ? onClose : () => {}}>
      <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AlertDialogHeader className={language === 'ar' ? 'text-end' : 'text-start'}>
          <AlertDialogTitle className={`font-black uppercase tracking-tighter text-red-600 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {dict.dashboard.customersPage.modals.delete.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium">
            {dict.dashboard.customersPage.modals.delete.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
          <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
            {dict.dashboard.customersPage.modals.delete.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="rounded-sm font-bold uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing && <Loader2 className="size-3 animate-spin me-2" />}
            {dict.dashboard.customersPage.modals.delete.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
