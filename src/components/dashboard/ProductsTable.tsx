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

interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: {
    _id: string;
    name: string;
  };
  badgeId?: {
    _id: string;
    name: string;
    color: string;
    textColor: string;
  };
  price: number;
  originalPrice?: number;
  images: {
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
  stock: number;
  featured: boolean;
}

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
        title: 'Product deleted',
        description: 'The product has been removed successfully.',
        type: 'success',
      });
      
      router.refresh();
    } catch (error) {
      toast.addToast({
        title: 'Error',
        description: 'Failed to delete the product.',
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
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
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
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Category</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateQueryParams({ categoryId: null, page: '1' })}>
                All Categories
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat._id} 
                  onClick={() => updateQueryParams({ categoryId: cat._id, page: '1' })}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/50">
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
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold">{product.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground lowercase">
                          {product.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                        {product.categoryId?.name || 'Uncategorized'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">EGP {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            EGP {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          product.stock === 0 ? 'text-red-600' : 
                          product.stock < 10 ? 'text-amber-600' : 
                          'text-emerald-600'
                        }`}>
                          {product.stock}
                        </span>
                        {product.stock === 0 && (
                          <Badge variant="destructive" className="h-4 px-1 text-[8px] uppercase">Out</Badge>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <Badge variant="outline" className="h-4 px-1 text-[8px] uppercase border-amber-200 text-amber-700 bg-amber-50">Low</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.featured && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border-amber-200 shadow-sm">
                            Featured
                          </Badge>
                        )}
                        {product.badgeId && (
                          <span 
                            className="px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm border border-black/5"
                            style={{ backgroundColor: product.badgeId.color, color: product.badgeId.textColor }}
                          >
                            {product.badgeId.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-sm shadow-xl">
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product.slug}/edit`)} className="text-xs font-medium focus:bg-slate-50 cursor-pointer">
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                            onClick={() => {
                              setDeleteId(product._id);
                              setDeleteSlug(product.slug);
                            }}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateQueryParams({ page: (page - 1).toString() })}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateQueryParams({ page: (page + 1).toString() })}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => { if(!isPending) { setDeleteId(null); setDeleteSlug(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove it from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                startTransition(handleDelete);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
