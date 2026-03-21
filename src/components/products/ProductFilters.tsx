'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Package, 
  LayoutGrid, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw 
} from 'lucide-react';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { Button } from '@/components/ui/button';

interface Category {
  id: string | null;
  name: string;
  nameAr?: string;
  slug: string;
  image?: string | null;
}

interface ProductFiltersProps {
  currentCategory?: string;
  currentSort?: string;
  initialCategories: Category[];
  locale: string;
}

export function ProductFilters({ 
  currentSort,
  initialCategories,
  locale
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = locale === 'ar' ? ar : en;
  
  // Initialize with All Products + initialCategories
  const [categories] = useState<Category[]>([
    { id: null, name: dict.common.allProducts, nameAr: dict.common.allProducts, slug: '' }, 
    ...initialCategories
  ]);
  
  const SORT_OPTIONS = [
    { val: 'newest', label: dict.products.sortNewest, icon: Clock },
    { val: 'price_asc', label: dict.products.sortPriceAsc, icon: TrendingUp },
    { val: 'price_desc', label: dict.products.sortPriceDesc, icon: TrendingDown }
  ];
  
  const currentCategorySlug = searchParams.get('category');

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filtering
    if (key !== 'page') params.delete('page');
    
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName === dict.common.allProducts.toLowerCase() || lowerName === 'all products') return LayoutGrid;
    if (lowerName.includes('diag')) return Stethoscope;
    if (lowerName.includes('surger')) return Activity;
    if (lowerName.includes('kit')) return Package;
    return Package; // Default
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">{dict.common.filterByCategory}</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = getIcon(cat.name);
              const isActive = (!currentCategorySlug && !cat.slug) || (currentCategorySlug === cat.slug);
              const categoryName = locale === 'ar' && cat.nameAr ? cat.nameAr : cat.name;
              
              return (
                <Button
                  key={cat.slug || 'all'}
                  onClick={() => updateParams('category', cat.slug || null)}
                  variant={isActive ? "default" : "outline"}
                  className={`w-full flex items-center gap-3 p-4 h-auto transition-all rounded-[var(--radius)] uppercase tracking-widest text-[10px] font-bold text-start border ${
                    isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                      : 'bg-background border-slate-100 text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  <Icon className="size-4 stroke-[2px]" />
                  <span className="flex-1">{categoryName}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">{dict.common.sortBy}</h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = currentSort === s.val;
              return (
                <Button
                  key={s.val}
                  onClick={() => updateParams('sort', s.val)}
                  variant={isActive ? "default" : "outline"}
                  className={`w-full flex items-center gap-3 p-4 h-auto transition-all rounded-[var(--radius)] uppercase tracking-widest text-[10px] font-bold text-start border ${
                    isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                      : 'bg-background border-slate-100 text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  <Icon className="size-4 stroke-[2px]" />
                  <span className="flex-1">{s.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={clearFilters}
          className="w-full py-4 h-14 border border-primary/20 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 rounded-[var(--radius)] uppercase tracking-widest text-[10px]"
        >
          <span>{dict.common.resetFilters}</span>
          <RefreshCw className="size-3.5 stroke-[2.5px]" />
        </Button>
      </div>
    </aside>
  );
}
