'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop Component
 * 
 * Tool used to force scroll restoration to [0,0] on every route change.
 * This fixes issues where Next.js default scroll restoration fails inside
 * custom overflow containers or complex layout transitions.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset window scroll
    window.scrollTo(0, 0);
    
    // Reset document element and body as a safety fallback
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // Attempt to reset potential overflow containers in dashboard
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
