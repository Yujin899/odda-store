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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { toast } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { Product } from '@/types/store';

// Product interface is already defined in store.ts

interface ProductsTableProps {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  categories: { _id: string; name: string }[];
}

export function ProductsTable({ 
  products, 
  total, 
  page, 
  limit, 
  categories 
}: ProductsTableProps) {
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
      const res = await fetch(`/api/products/${deleteSlug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      toast.addToast({
        title: dict.toasts.success,
        description: dict.toasts.productDeleted,
        type: 'success',
      });
      
      router.refresh();
    } catch {
      toast.addToast({
        title: dict.toasts.error,
        description: dict.toasts.productDeleteFailed,
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
          <Search className={`absolute ${language === 'ar' ? 'inset-e-2.5' : 'inset-s-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={dict.dashboard.productsPage.searchPlaceholder}
            className={language === 'ar' ? 'pe-8 font-medium' : 'ps-8 font-medium'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateQueryParams({ search: searchTerm || null, page: '1' });
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1 font-bold uppercase tracking-widest text-[10px]">
                <Filter className="h-3.5 w-3.5" />
                <span>{dict.dashboard.productsPage.table.category}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-48">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">{dict.dashboard.productsPage.filterByCategory}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateQueryParams({ categoryId: null, page: '1' })} className="text-xs font-bold uppercase tracking-widest">
                {dict.dashboard.productsPage.allCategories}
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat._id} 
                  onClick={() => updateQueryParams({ categoryId: cat._id, page: '1' })}
                  className="text-xs font-bold uppercase tracking-widest"
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className={`w-[80px] font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.image}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.name}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.category}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.price}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.stock}</TableHead>
              <TableHead className={`font-black uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-end' : 'text-start'}`}>{dict.dashboard.productsPage.table.badges}</TableHead>
              <TableHead className={`${language === 'ar' ? 'text-start' : 'text-end'} font-black uppercase text-[10px] tracking-widest`}>{dict.dashboard.productsPage.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                  {dict.dashboard.productsPage.empty}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                return (
                  <TableRow key={product._id}>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <div className={`relative h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/50 ${language === 'ar' ? 'me-0 ms-auto' : ''}`}>
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={product.name}
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
                    <TableCell className={`font-medium ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                      <div className="flex flex-col">
                        <span className={`font-bold ${language === 'ar' ? 'font-cairo text-sm' : ''}`}>
                          {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground lowercase">
                          {product.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <code className={`text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono ${language === 'ar' ? 'font-cairo' : ''}`}>
                        {language === 'ar' && typeof product.categoryId === 'object' ? product.categoryId?.nameAr : (typeof product.categoryId === 'object' ? product.categoryId?.name : (product.category?.name || 'Uncategorized'))}
                      </code>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-(--navy)">
                          {language === 'ar' ? '' : 'EGP'} {product.price.toLocaleString()} {language === 'ar' ? 'ج.م' : ''}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] font-bold text-muted-foreground line-through opacity-70">
                            {language === 'ar' ? '' : 'EGP'} {product.originalPrice.toLocaleString()} {language === 'ar' ? 'ج.م' : ''}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <div className={`flex items-center gap-2 w-full ${language === 'ar' ? 'justify-start' : ''}`}>
                        <span className={`text-xs font-black ${
                          product.stock === 0 ? 'text-red-600' : 
                          product.stock < 10 ? 'text-amber-600' : 
                          'text-emerald-600'
                        }`}>
                          {product.stock}
                        </span>
                        {product.stock === 0 && (
                          <Badge variant="destructive">{dict.dashboard.productsPage.badges.outOfStock}</Badge>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
                            {dict.dashboard.productsPage.badges.lowStock}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-end' : 'text-start'}>
                      <div className={`flex gap-1 flex-wrap w-full ${language === 'ar' ? 'justify-start' : ''}`}>
                        {product.featured && (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                            {dict.dashboard.productsPage.badges.featured}
                          </Badge>
                        )}
                        {product.badgeId && (
                          <Badge 
                            className="border-white/10 shadow-sm"
                            style={{ 
                              backgroundColor: typeof product.badgeId === 'object' ? product.badgeId?.color : '', 
                              color: typeof product.badgeId === 'object' ? product.badgeId?.textColor : '' 
                            }}
                          >
                            {language === 'ar' && typeof product.badgeId === 'object' ? product.badgeId?.nameAr : (typeof product.badgeId === 'object' ? product.badgeId?.name : (typeof product.badgeId === 'string' ? product.badgeId : ''))}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={language === 'ar' ? 'text-start' : 'text-end'}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-40 rounded-sm shadow-xl border-slate-200">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-3">{dict.dashboard.productsPage.table.actions}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product.slug}/edit`)} className="text-[10px] font-black uppercase tracking-widest focus:bg-slate-50 cursor-pointer p-3 group">
                            <Pencil className="me-2 h-3.5 w-3.5 text-slate-400 group-hover:text-(--navy) transition-colors" />
                            {dict.common.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[10px] font-black uppercase tracking-widest text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer p-3 group"
                            onClick={() => {
                              setDeleteId(product._id);
                              setDeleteSlug(product.slug);
                            }}
                          >
                            <Trash2 className="me-2 h-3.5 w-3.5 text-red-400 group-hover:text-red-600 transition-colors" />
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
          {dict.dashboard.productsPage.pagination.showing} <strong>{products.length}</strong> {dict.dashboard.productsPage.pagination.of} <strong>{total}</strong> {dict.dashboard.productsPage.title.toLowerCase()}
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
              {dict.dashboard.productsPage.deleteDialog.description}
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
