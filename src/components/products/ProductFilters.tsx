'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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

interface Category {
  _id: string | null;
  name: string;
}

const SORT_OPTIONS = [
  { val: 'newest', label: 'Newest First', icon: Clock },
  { val: 'price_asc', label: 'Price: Low to High', icon: TrendingUp },
  { val: 'price_desc', label: 'Price: High to Low', icon: TrendingDown }
];

export function ProductFilters({ currentCategory: _currentCategory, currentSort }: { currentCategory?: string; currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories([{ _id: null, name: 'All Products' }, ...(data.categories || [])]);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

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
    if (name === 'All Products') return LayoutGrid;
    if (name.toLowerCase().includes('diag')) return Stethoscope;
    if (name.toLowerCase().includes('surger')) return Activity;
    if (name.toLowerCase().includes('kit')) return Package;
    return Package; // Default
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">Filter by category</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = getIcon(cat.name);
              const isActive = (!currentCategoryId && cat._id === null) || (currentCategoryId === cat._id);
              return (
                <button
                  key={String(cat._id)}
                  onClick={() => updateParams('categoryId', cat._id)}
                  className={`w-full flex items-center gap-3 p-4 border transition-all rounded-(--radius) uppercase tracking-widest text-[10px] font-bold text-left cursor-pointer outline-none ${
                    isActive 
                      ? 'bg-(--primary) border-(--primary) text-white shadow-lg' 
                      : 'bg-background border-slate-100 text-muted-foreground hover:border-(--primary)/30 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="size-4 stroke-[2px]" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">Sort by</h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = currentSort === s.val;
              return (
                <button
                  key={s.val}
                  onClick={() => updateParams('sort', s.val)}
                  className={`w-full flex items-center gap-3 p-4 border transition-all rounded-(--radius) uppercase tracking-widest text-[10px] font-bold text-left cursor-pointer outline-none ${
                    isActive 
                      ? 'bg-(--primary) border-(--primary) text-white shadow-lg' 
                      : 'bg-background border-slate-100 text-muted-foreground hover:border-(--primary)/30 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="size-4 stroke-[2px]" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <button 
          onClick={clearFilters}
          className="w-full py-4 border border-(--primary)/20 text-(--primary) font-bold hover:bg-(--primary) hover:text-white transition-all flex items-center justify-center gap-2 rounded-(--radius) outline-none cursor-pointer uppercase tracking-widest text-[10px]"
        >
          <span>Reset Filters</span>
          <RefreshCw className="size-3.5 stroke-[2.5px]" />
        </button>
      </div>
    </aside>
  );
}
