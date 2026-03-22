'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, ShieldAlert } from 'lucide-react';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  isProcessing: boolean;
  newPassword: string;
  setNewPassword: (val: string) => void;
  dict: any;
  language: string;
}

export function ResetPasswordDialog({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  newPassword,
  setNewPassword,
  dict,
  language,
}: ResetPasswordDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-sm">
        <form onSubmit={onConfirm} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader className="text-start">
            <DialogTitle className={`font-black uppercase tracking-tighter text-xl ${language === 'ar' ? 'font-cairo' : ''}`}>
              {dict.dashboard.customersPage.modals.reset.title}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {dict.dashboard.customersPage.modals.reset.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block text-start">
                {dict.dashboard.customersPage.modals.reset.password}
              </Label>
              <Input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={dict.dashboard.customersPage.modals.reset.placeholder}
                className="rounded-sm border-slate-200 text-sm text-start"
                required
              />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-sm flex items-start gap-3">
              <ShieldAlert className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                {dict.dashboard.customersPage.modals.reset.notice}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">
              {dict.dashboard.customersPage.modals.reset.cancel}
            </Button>
            <Button type="submit" disabled={isProcessing} className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-amber-600/20">
              {isProcessing ? <Loader2 className="size-4 animate-spin me-2" /> : <KeyRound className="size-4 me-2" />}
              {dict.dashboard.customersPage.modals.reset.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
