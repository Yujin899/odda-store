'use client';

import { Menu } from 'lucide-react';
import { useMobileMenuStore } from '@/store/useMobileMenuStore';
import { Button } from '@/components/ui/button';

export function NavbarMobileMenuTrigger() {
  const { open } = useMobileMenuStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => open()}
      className="md:hidden flex items-center justify-center p-2 rounded-(--radius) text-navy hover:bg-navy/5 transition-colors border-none"
      aria-label="Open mobile menu"
    >
      <Menu className="size-6 stroke-[2.5px]" />
    </Button>
  );
}
