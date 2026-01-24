'use client';

import { useCartStore } from '@/lib/store';
import { formatPrice, formatPriceDecimal } from '@/lib/price';
import { useRouter } from 'next/navigation';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const router = useRouter();

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="sticky top-24">
        <div className="border border-gray-200 rounded-2xl p-8 bg-white">
          <h2 className="text-xl font-light tracking-tight text-black mb-6 uppercase">
            Cart
          </h2>
          <div className="text-center py-16">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-light">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24">
      <div className="border border-gray-200 rounded-2xl p-8 bg-white">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-light tracking-tight text-black uppercase">
            Cart
          </h2>
          <span className="text-xs text-gray-600 font-light uppercase tracking-wider">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
          {items.map((item, index) => (
            <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-black mb-1">{item.name}</h4>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-xs text-gray-600 font-light">
                      {item.modifiers.map((m) => m.name).join(', ')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 font-light italic mt-1">{item.notes}</p>
                  )}
                </div>
                <span className="text-sm font-light text-black ml-4">
                  {formatPrice((Number(item.price) + (item.modifiers?.reduce((s, m) => s + Number(m.price), 0) || 0)) * item.quantity)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1, item.modifierIds)}
                    className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors font-light text-lg"
                  >
                    −
                  </button>
                  <span className="text-sm font-light text-black w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1, item.modifierIds)}
                    className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors font-light"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.menuItemId, item.modifierIds)}
                  className="text-xs text-gray-500 hover:text-black uppercase tracking-wider font-light transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-light">Subtotal</span>
            <span className="text-black font-light">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-light">Tax</span>
            <span className="text-black font-light">{formatPrice(tax)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <span className="text-sm uppercase tracking-wider text-black font-medium">
            Total
          </span>
          <span className="text-2xl font-light text-black">
            {formatPrice(total)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
