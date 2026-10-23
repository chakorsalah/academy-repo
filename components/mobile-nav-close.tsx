'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Closes the phone menu (<details class="mobile-nav">) when a link inside it is tapped
// and whenever the page changes, so the new page isn't hidden behind the open menu.
export function MobileNavClose() {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelectorAll('details.mobile-nav[open]').forEach(d => d.removeAttribute('open'));
  }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('.mobile-panel a');
      if (link) link.closest('details')?.removeAttribute('open');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
