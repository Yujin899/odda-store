'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';
import { ColorPicker } from '@/components/dashboard/ColorPicker';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface Badge {
  _id: string;
  name: string;
  nameAr?: string;
  color: string;
  textColor: string;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    color: '#000000',
    textColor: '#FFFFFF'
  });

  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/badges');
      const data = await res.json();
      if (res.ok) {
        setBadges(data.badges);
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.somethingWentWrong, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, dict.toasts.error, dict.toasts.somethingWentWrong]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const openModal = (badge?: Badge) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        name: badge.name,
        nameAr: badge.nameAr || '',
        color: badge.color,
        textColor: badge.textColor
      });
    } else {
      setEditingBadge(null);
      setFormData({
        name: '',
        nameAr: '',
        color: '#000000',
        textColor: '#FFFFFF'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingBadge ? `/api/badges/${editingBadge._id}` : '/api/badges';
      const method = editingBadge ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ 
          title: dict.toasts.success, 
          description: dict.toasts.badgeSaved, 
          type: 'success' 
        });
        setIsModalOpen(false);
        fetchBadges();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.badgeFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/badges/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        addToast({ title: dict.toasts.success, description: dict.toasts.badgeDeleted, type: 'success' });
        fetchBadges();
      } else {
        addToast({ title: dict.toasts.error, description: data.message || dict.toasts.badgeDeleteFailed, type: 'error' });
      }
    } catch {
      addToast({ title: dict.toasts.error, description: dict.toasts.somethingWentWrong, type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (badge.nameAr && badge.nameAr.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`p-6 space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[var(--navy)]">{dict.dashboard.badgesPage.title}</h1>
          <p className="text-sm text-slate-500 font-medium">{dict.dashboard.badgesPage.subtitle}</p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-[var(--primary)]/20 rounded-sm"
        >
          <Plus className={`size-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {dict.dashboard.badgesPage.addBadge}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className={`p-4 border-b border-slate-100 flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 size-4 text-slate-400`} />
            <Input 
              placeholder={dict.dashboard.badgesPage.searchPlaceholder} 
              className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} h-10 border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 rounded-sm text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className={`w-[120px] text-xs font-bold uppercase tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.badgesPage.table.preview}</TableHead>
              <TableHead className={`text-xs font-bold uppercase tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.badgesPage.table.name}</TableHead>
              <TableHead className={`text-xs font-bold uppercase tracking-widest text-slate-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.badgesPage.table.colors}</TableHead>
              <TableHead className={`${language === 'ar' ? 'text-left pl-4' : 'text-right pr-4'} text-xs font-bold uppercase tracking-widest text-slate-500`}>{dict.dashboard.badgesPage.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500 italic">
                  <div className={`flex items-center justify-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Loader2 className="size-4 animate-spin" />
                    {dict.dashboard.badgesPage.loading}
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBadges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500 italic">
                  {dict.dashboard.badgesPage.empty}
                </TableCell>
              </TableRow>
            ) : (
              filteredBadges.map((badge) => (
                <TableRow key={badge._id} className="hover:bg-slate-50 transition-colors border-slate-50">
                  <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <span 
                      className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm inline-block ${language === 'ar' ? 'font-cairo' : ''}`}
                      style={{ backgroundColor: badge.color, color: badge.textColor }}
                    >
                      {language === 'ar' && badge.nameAr ? badge.nameAr : badge.name}
                    </span>
                  </TableCell>
                  <TableCell className={`font-bold text-[var(--navy)] ${language === 'ar' ? 'text-right font-cairo' : 'text-left'}`}>
                    {language === 'ar' && badge.nameAr ? badge.nameAr : badge.name}
                  </TableCell>
                  <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-sm border border-slate-200" style={{ backgroundColor: badge.color }} />
                        <code className="text-[9px] font-mono text-slate-500 uppercase">{badge.color}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-sm border border-slate-200" style={{ backgroundColor: badge.textColor }} />
                        <code className="text-[9px] font-mono text-slate-500 uppercase">{badge.textColor}</code>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`${language === 'ar' ? 'text-left pl-4' : 'text-right pr-4'} py-4`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-40 rounded-sm overflow-hidden">
                        <DropdownMenuLabel className={`text-[10px] uppercase tracking-widest text-slate-400 ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.badgesPage.table.actions}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openModal(badge)}
                          className={`text-xs font-medium focus:bg-slate-50 cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          <Pencil className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {dict.common.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className={`text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                          onClick={() => setDeleteId(badge._id)}
                        >
                          <Trash2 className={`size-3 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {dict.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <form onSubmit={handleSave}>
            <DialogHeader className={language === 'ar' ? 'text-right' : ''}>
              <DialogTitle className="font-black uppercase tracking-tighter text-xl">
                {editingBadge ? dict.dashboard.badgesPage.modal.editTitle : dict.dashboard.badgesPage.modal.newTitle}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {dict.dashboard.badgesPage.modal.description}
              </DialogDescription>
            </DialogHeader>

            <div className={`py-6 space-y-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.badgesPage.modal.name} (EN)</Label>
                  </div>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Discount"
                    className={`rounded-sm border-slate-200 focus:border-(--primary) text-sm`}
                    required
                  />
                </div>
                <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <Label htmlFor="nameAr" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.badgesPage.modal.name} (AR)</Label>
                  <Input 
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: خصم"
                    className={`rounded-sm border-slate-200 focus:border-(--primary) text-sm text-right font-cairo`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorPicker 
                  label={dict.dashboard.badgesPage.modal.bg}
                  color={formData.color}
                  onChange={(color) => setFormData({ ...formData, color })}
                />
                <ColorPicker 
                  label={dict.dashboard.badgesPage.modal.text}
                  color={formData.textColor}
                  onChange={(color) => setFormData({ ...formData, textColor: color })}
                />
              </div>

              <div className="pt-2">
                <Label className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2 ${language === 'ar' ? 'text-right' : ''}`}>{dict.dashboard.badgesPage.modal.preview}</Label>
                <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-sm flex items-center justify-center">
                  <span 
                    className={`px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest shadow-lg transition-all ${language === 'ar' ? 'font-cairo' : ''}`}
                    style={{ backgroundColor: formData.color, color: formData.textColor }}
                  >
                    {language === 'ar' && formData.nameAr ? formData.nameAr : (formData.name || (language === 'ar' ? 'معاينة' : 'Preview'))}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className={`gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200"
              >
                {dict.dashboard.badgesPage.modal.cancel}
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-[var(--primary)]/20 rounded-sm"
              >
                {isSaving ? <Loader2 className={`size-4 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} /> : <Check className={`size-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />}
                {editingBadge ? dict.dashboard.badgesPage.modal.update : dict.dashboard.badgesPage.modal.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader className={language === 'ar' ? 'text-right' : ''}>
            <AlertDialogTitle className="font-black uppercase tracking-tighter">{dict.dashboard.badgesPage.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              {dict.dashboard.badgesPage.deleteDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">{dict.dashboard.badgesPage.deleteDialog.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold uppercase tracking-widest text-[10px]"
            >
              {dict.dashboard.badgesPage.deleteDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
