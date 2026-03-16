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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Check } from 'lucide-react';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  isProcessing: boolean;
  editFormData: { name: string; email: string; role: 'customer' | 'admin' };
  setEditFormData: (data: any) => void;
  dict: any;
  language: string;
}

export function EditUserDialog({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  editFormData,
  setEditFormData,
  dict,
  language,
}: EditUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-sm">
        <form onSubmit={onConfirm} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader className={language === 'ar' ? 'text-end' : 'text-start'}>
            <DialogTitle className={`font-black uppercase tracking-tighter text-xl ${language === 'ar' ? 'font-cairo' : ''}`}>
              {dict.dashboard.customersPage.modals.edit.title}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {dict.dashboard.customersPage.modals.edit.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {dict.dashboard.customersPage.modals.edit.name}
              </Label>
              <Input 
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'text-end' : ''}`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {dict.dashboard.customersPage.modals.edit.email}
              </Label>
              <Input 
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'text-end' : ''}`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {dict.dashboard.customersPage.modals.edit.role}
              </Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(val: 'customer' | 'admin') => setEditFormData({ ...editFormData, role: val })}
              >
                <SelectTrigger className={`rounded-sm border-slate-200 text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectItem value="customer" className="text-sm">{dict.dashboard.customersPage.roles.customer}</SelectItem>
                  <SelectItem value="admin" className="text-sm">{dict.dashboard.customersPage.roles.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className={`gap-3 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200">
              {dict.dashboard.customersPage.modals.edit.cancel}
            </Button>
            <Button type="submit" disabled={isProcessing} className="flex-1 sm:flex-none bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-sm shadow-lg shadow-(--primary)/20">
              {isProcessing ? <Loader2 className="size-4 animate-spin me-2" /> : <Check className="size-4 me-2" />}
              {dict.dashboard.customersPage.modals.edit.update}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
