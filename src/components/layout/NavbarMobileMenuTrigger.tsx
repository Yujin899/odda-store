'use client';

import { Menu } from 'lucide-react';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';

export function NavbarMobileMenuTrigger() {
  const { open } = useMobileMenuStore();

  return (
    <button
      onClick={() => open()}
      className="md:hidden flex items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none outline-none cursor-pointer bg-transparent"
      aria-label="Open mobile menu"
    >
      <Menu className="size-6 stroke-[2.5px]" />
    </button>
  );
}
