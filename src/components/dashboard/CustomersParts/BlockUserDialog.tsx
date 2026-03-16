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

interface BlockUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  isBlocked: boolean;
  dict: any;
  language: string;
}

export function BlockUserDialog({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  isBlocked,
  dict,
  language,
}: BlockUserDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={isOpen ? onClose : () => {}}>
      <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AlertDialogHeader className={language === 'ar' ? 'text-end' : 'text-start'}>
          <AlertDialogTitle className={`font-black uppercase tracking-tighter ${language === 'ar' ? 'font-cairo' : ''}`}>
            {isBlocked ? dict.dashboard.customersPage.modals.block.unblockTitle : dict.dashboard.customersPage.modals.block.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium">
            {isBlocked 
              ? dict.dashboard.customersPage.modals.block.unblockDescription 
              : dict.dashboard.customersPage.modals.block.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
          <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
            {dict.dashboard.customersPage.modals.block.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`rounded-sm font-bold uppercase tracking-widest text-[10px] text-white ${
              isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isProcessing && <Loader2 className="size-3 animate-spin me-2" />}
            {isBlocked ? dict.dashboard.customersPage.modals.block.confirmUnblock : dict.dashboard.customersPage.modals.block.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
