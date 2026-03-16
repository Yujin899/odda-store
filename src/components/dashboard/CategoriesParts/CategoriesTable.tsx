'use client';

import { 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
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

interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

interface CategoriesTableProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  dict: any;
  language: string;
}

export function CategoriesTable({
  categories,
  searchQuery,
  setSearchQuery,
  isLoading,
  onEdit,
  onDelete,
  dict,
  language
}: CategoriesTableProps) {
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            placeholder={dict.dashboard.categoriesPage.searchPlaceholder}
            className={`h-10 border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 rounded-sm text-sm ${language === 'ar' ? 'pe-10' : 'ps-10'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="w-[80px] text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.image}</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.name}</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.slug}</TableHead>
            <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest text-slate-500 text-start">{dict.dashboard.categoriesPage.table.description}</TableHead>
            <TableHead className="text-end ps-4 text-xs font-bold uppercase tracking-widest text-slate-500">{dict.dashboard.categoriesPage.table.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                <div className={`flex items-center justify-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Loader2 className="size-4 animate-spin" />
                  {dict.dashboard.categoriesPage.loading}
                </div>
              </TableCell>
            </TableRow>
          ) : filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                {dict.dashboard.categoriesPage.empty}
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((category) => (
              <TableRow key={category._id} className="hover:bg-slate-50 transition-colors border-slate-50">
                <TableCell className="text-start font-cairo">
                  <div className="size-10 rounded-sm overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner ms-auto me-0">
                    {category.image ? (
                      <Image 
                        src={category.image} 
                        alt={language === 'ar' && category.nameAr ? category.nameAr : category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center size-full">
                        <ImageIcon className="size-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className={`font-bold text-(--navy) text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
                  {language === 'ar' && category.nameAr ? category.nameAr : category.name}
                </TableCell>
                <TableCell className="text-start">
                  <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono uppercase tracking-tighter">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className={`hidden md:table-cell max-w-[200px] truncate text-sm text-slate-500 text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
                  {language === 'ar' && category.descriptionAr ? category.descriptionAr : (category.description || '-')}
                </TableCell>
                <TableCell className="text-end ps-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-sm overflow-hidden">
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 text-start">{dict.dashboard.categoriesPage.table.actions}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onEdit(category)}
                        className="text-xs font-medium focus:bg-slate-50 cursor-pointer"
                      >
                        <Pencil className="size-3 me-2" />
                        {dict.common.edit}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                        onClick={() => onDelete(category._id)}
                      >
                        <Trash2 className="size-3 me-2" />
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
  );
}
