'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
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
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  PackagePlus
} from 'lucide-react';
import { toast } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface Bundle {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
}

interface BundlesTableProps {
  bundles: Bundle[];
  total: number;
  page: number;
  limit: number;
}

export function BundlesTable({ 
  bundles, 
  total, 
  page, 
  limit 
}: BundlesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const totalPages = Math.ceil(total / limit);

  const updateQueryParams = (params: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    router.push(`?${nextParams.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteSlug) return;

    try {
      const res = await fetch(`/api/bundles/${deleteSlug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete bundle');

      toast.addToast({
        title: dict.toasts.success,
        description: language === 'ar' ? 'تم حذف العرض بنجاح' : 'Bundle deleted successfully',
        type: 'success',
      });
      
      router.refresh();
    } catch (error) {
      toast.addToast({
        title: dict.toasts.error,
        description: language === 'ar' ? 'فشل حذف العرض' : 'Failed to delete bundle',
        type: 'error',
      });
    } finally {
      setDeleteId(null);
      setDeleteSlug(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className={`absolute ${language === 'ar' ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={language === 'ar' ? 'بحث عن العروض...' : 'Search bundles...'}
            className={language === 'ar' ? 'pr-8 font-medium' : 'pl-8 font-medium'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateQueryParams({ search: searchTerm || null, page: '1' });
              }
            }}
          />
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard/bundles/new')}
          className="bg-(--primary) text-white font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-sm"
        >
          <PackagePlus className="size-3.5 mr-2" />
          {language === 'ar' ? 'إضافة عرض جديد' : 'Add New Bundle'}
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className={`w-[80px] font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productsPage.table.image}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productsPage.table.name}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productsPage.table.price}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{dict.dashboard.productsPage.table.stock}</TableHead>
              <TableHead className={`${language === 'ar' ? 'text-left' : 'text-right'} font-black uppercase text-[10px] tracking-widest`}>{dict.dashboard.productsPage.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                  {language === 'ar' ? 'لا توجد عروض.' : 'No bundles found.'}
                </TableCell>
              </TableRow>
            ) : (
              bundles.map((bundle) => {
                const primaryImage = bundle.images[0];
                return (
                  <TableRow key={bundle._id}>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <div className={`relative h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/50 ${language === 'ar' ? 'mr-0 ml-auto' : ''}`}>
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={bundle.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground italic">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="flex flex-col">
                        <span className={`font-bold ${language === 'ar' ? 'font-cairo text-sm' : ''}`}>
                          {language === 'ar' && bundle.nameAr ? bundle.nameAr : bundle.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground lowercase">
                          {bundle.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-(--navy)">
                          {language === 'ar' ? '' : 'EGP'} {bundle.price.toLocaleString()} {language === 'ar' ? 'ج.م' : ''}
                        </span>
                        {bundle.compareAtPrice && (
                          <span className="text-[10px] font-bold text-muted-foreground line-through opacity-70">
                            {language === 'ar' ? '' : 'EGP'} {bundle.compareAtPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : ''}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <span className={`text-xs font-black ${bundle.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {bundle.stock}
                      </span>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-left' : 'text-right'}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-40 rounded-sm shadow-xl border-slate-200">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-3">{dict.dashboard.productsPage.table.actions}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/bundles/${bundle.slug}/edit`)} className="text-[10px] font-black uppercase tracking-widest focus:bg-slate-50 cursor-pointer p-3 group">
                            <Pencil className="mr-2 h-3.5 w-3.5 text-slate-400 group-hover:text-(--navy) transition-colors" />
                            {dict.common.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[10px] font-black uppercase tracking-widest text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer p-3 group"
                            onClick={() => {
                              setDeleteId(bundle._id);
                              setDeleteSlug(bundle.slug);
                            }}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-red-400 group-hover:text-red-600 transition-colors" />
                            {dict.common.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {dict.dashboard.productsPage.pagination.showing} <strong>{bundles.length}</strong> {dict.dashboard.productsPage.pagination.of} <strong>{total}</strong> {language === 'ar' ? 'عروض' : 'bundles'}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 font-black uppercase tracking-widest text-[10px] gap-2"
            disabled={page <= 1}
            onClick={() => updateQueryParams({ page: (page - 1).toString() })}
          >
            <ChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            {dict.dashboard.productsPage.pagination.previous}
          </Button>
          <div className="text-[10px] font-black uppercase tracking-widest px-4 border-x border-slate-200">
            {dict.dashboard.productsPage.pagination.page} {page} {dict.dashboard.productsPage.pagination.of} {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 font-black uppercase tracking-widest text-[10px] gap-2"
            disabled={page >= totalPages}
            onClick={() => updateQueryParams({ page: (page + 1).toString() })}
          >
            {dict.dashboard.productsPage.pagination.next}
            <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => { if(!isPending) { setDeleteId(null); setDeleteSlug(null); } }}>
        <AlertDialogContent className="rounded-sm border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tighter text-xl text-(--navy)">{dict.dashboard.productsPage.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-slate-500 leading-relaxed">
              {language === 'ar' ? 'هل أنت متأكد من حذف هذا العرض؟ سيتم إزالته نهائياً.' : 'Are you sure you want to delete this bundle? This will permanently remove it.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-sm font-black uppercase tracking-widest text-[10px] border-slate-200">{dict.dashboard.productsPage.deleteDialog.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                startTransition(handleDelete);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-sm font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20"
            >
              {isPending ? dict.dashboard.productsPage.deleteDialog.deleting : dict.dashboard.productsPage.deleteDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
