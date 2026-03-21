'use client';

import { Search } from 'lucide-react';
import { useSearchUIStore } from '@/store/useSearchUIStore';
import { Button } from '@/components/ui/button';

export function NavbarSearchTrigger() {
  const { openSearch } = useSearchUIStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => openSearch()}
      className="flex items-center justify-center p-2 rounded-[var(--radius)] text-foreground hover:bg-slate-100 transition-colors border-none"
      aria-label="Open search"
    >
      <Search className="size-5 stroke-[2.5px]" />
    </Button>
  );
}
