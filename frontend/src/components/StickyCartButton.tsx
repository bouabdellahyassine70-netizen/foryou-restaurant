'use client';

import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/price';
import { useState, useEffect } from 'react';

export function StickyCartButton() {
  const { getItemCount, getTotal } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return empty div to maintain consistent structure during SSR
    return <div className="fixed bottom-8 right-8" style={{ visibility: 'hidden' }} aria-hidden="true" />;
  }

  const itemCount = getItemCount();
  const total = getTotal();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => router.push('/checkout')}
      className="fixed bottom-8 right-8 bg-black text-white px-8 py-4 rounded-full shadow-lg hover:bg-gray-900 transition-all z-50 flex items-center gap-4 hover-lift"
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
      <div className="text-left border-l border-white/20 pl-4">
        <div className="text-sm font-medium">{formatPrice(total)}</div>
        <div className="text-xs text-white/70 font-light">Checkout</div>
      </div>
    </button>
  );
}
