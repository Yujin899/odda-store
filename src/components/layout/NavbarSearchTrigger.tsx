'use client';

import { Search } from 'lucide-react';
import { useSearchUIStore } from '@/store/useSearchUIStore';

export function NavbarSearchTrigger({ dict }: { dict: Record<string, any> }) {
  const { openSearch } = useSearchUIStore();

  return (
    <>
      {/* Mobile: icon-only search trigger */}
      <button
        onClick={() => openSearch()}
        className="sm:hidden hidden items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
        aria-label="Open search"
      >
        <Search className="size-5 stroke-[2.5px]" />
      </button>

      {/* Desktop: full search bar */}
      <div 
        onClick={() => openSearch()}
        className="hidden sm:flex items-center border border-navy/20 px-3 py-1.5 rounded-sm bg-background cursor-pointer hover:border-navy/40 transition-all"
      >
        <Search className="size-4 text-navy/50 stroke-[2.5px]" />
        <span className="text-sm w-40 bg-transparent text-navy/50 ms-2">{dict.common.search}</span>
      </div>
    </>
  );
}
