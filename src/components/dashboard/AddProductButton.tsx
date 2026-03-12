'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AddProductButton() {
  const router = useRouter();

  return (
    <Button 
      onClick={() => router.push('/dashboard/products/new')}
      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-[var(--primary)]/20 rounded-sm"
    >
      <Plus className="size-4 mr-2" />
      Add Product
    </Button>
  );
}
