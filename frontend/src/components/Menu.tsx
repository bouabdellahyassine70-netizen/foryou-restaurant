'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';
import Image from 'next/image';
import { formatPrice, formatPriceDecimal } from '@/lib/price';

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image?: string | null;
  modifiers?: Modifier[];
}

interface Modifier {
  id: string;
  name: string;
  price: number | string;
}

export function Menu() {
  const { data: categories, isLoading, error, refetch } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await api.get('/menu/categories');
        const data = res.data || [];
        console.log('Menu data received:', data.length, 'categories');
        const categoriesWithItems = data.filter((cat: Category) => cat.items && Array.isArray(cat.items) && cat.items.length > 0);
        console.log('Categories with items:', categoriesWithItems.length);
        if (categoriesWithItems.length > 0) {
          console.log('Sample category:', { name: categoriesWithItems[0].name, items: categoriesWithItems[0].items?.length || 0 });
        }
        return data;
      } catch (err: any) {
        console.error('Error fetching menu:', err);
        console.error('Error details:', err.response?.data || err.message);
        return [];
      }
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: true,
  });

  if (error) {
    console.error('Menu query error:', error);
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-light text-lg">Error loading menu. Please try again.</p>
        <p className="text-gray-500 text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  if (isLoading || !categories) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-8">
            <div className="h-8 bg-gray-100 w-48 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((j) => (
                <div key={j} className="h-96 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter categories that have items
  const categoriesWithItems = categories.filter(
    (category) => category.items && Array.isArray(category.items) && category.items.length > 0
  );

  console.log('Total categories:', categories.length);
  console.log('Categories with items:', categoriesWithItems.length);
  console.log('Category breakdown:', categories.map(c => ({ 
    name: c.name, 
    itemsCount: c.items?.length || 0,
    isArray: Array.isArray(c.items),
    itemsType: typeof c.items
  })));

  if (categoriesWithItems.length === 0 && !isLoading && categories && categories.length > 0) {
    console.warn('No categories with items found!');
    console.warn('Categories received:', categories.map((c: Category) => ({ name: c.name, itemsCount: c.items?.length || 0 })));
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 font-light text-lg mb-4">No menu items available at the moment.</p>
        <button
          onClick={() => refetch()}
          className="text-black border border-black px-6 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
        <p className="text-gray-500 text-sm mt-4">Check browser console (F12) for details.</p>
      </div>
    );
  }

  if (categoriesWithItems.length === 0 && !isLoading && (!categories || categories.length === 0)) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 font-light text-lg mb-4">No categories found.</p>
        <button
          onClick={() => refetch()}
          className="text-black border border-black px-6 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-24 lg:space-y-32">
      {categoriesWithItems.map((category) => (
        <div key={category.id} className="space-y-12">
          <div className="border-b-2 border-black pb-4">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-black uppercase" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif' }}>
              {category.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      modifierIds: selectedModifiers,
      modifiers: (item.modifiers || [])
        .filter((m) => selectedModifiers.includes(m.id))
        .map((m) => ({
          id: m.id,
          name: m.name,
          price: Number(m.price),
        })),
      notes,
    });
    setShowModal(false);
    setSelectedModifiers([]);
    setNotes('');
  };

  const totalPrice =
    Number(item.price) +
    (item.modifiers || [])
      .filter((m) => selectedModifiers.includes(m.id))
      .reduce((sum, m) => sum + Number(m.price), 0);

  return (
    <>
      {/* Premium Dish Card - Updated Design */}
      <div
        className="card-product group cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          {item.image && item.image.trim() !== '' && item.image !== 'null' && item.image !== 'undefined' ? (
            <Image
              src={item.image}
              alt={item.name || 'Food item'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              onError={(e) => {
                // Hide image on error, show placeholder
                const target = e.target as HTMLImageElement;
                if (target) {
                  target.style.display = 'none';
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-gray-500 text-xs font-light uppercase tracking-wider">Food Photo</div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight text-black uppercase" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif' }}>
              {item.name}
            </h3>
            <span className="text-xl font-bold text-[#DC2626] whitespace-nowrap">
              {formatPrice(item.price)}
            </span>
          </div>
          {item.description && (
            <p className="text-base text-[#4B5563] font-normal leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Premium Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              {item.image && item.image.trim() !== '' && item.image !== 'null' && item.image !== 'undefined' ? (
                <Image
                  src={item.image}
                  alt={item.name || 'Food item'}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={95}
                  onError={(e) => {
                    // Hide image on error, show placeholder
                    const target = e.target as HTMLImageElement;
                    if (target) {
                      target.style.display = 'none';
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-gray-500 text-xs font-light uppercase tracking-wider">Food Photo</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-light tracking-tight text-black">
                  {item.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-black transition-colors text-2xl font-light"
                >
                  ×
                </button>
              </div>

              {item.description && (
                <p className="text-gray-600 font-light mb-8 leading-relaxed">
                  {item.description}
                </p>
              )}

              {(item.modifiers || []).length > 0 && (
                <div className="mb-8 pb-8 border-b border-gray-100">
                  <h4 className="text-sm font-medium uppercase tracking-wider text-black mb-4">
                    Customize
                  </h4>
                  <div className="space-y-3">
                    {(item.modifiers || []).map((modifier) => (
                      <label
                        key={modifier.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-black transition-colors cursor-pointer"
                      >
                        <span className="text-sm text-black font-light">{modifier.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 font-light">
                            +{formatPrice(modifier.price)}
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedModifiers.includes(modifier.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedModifiers([...selectedModifiers, modifier.id]);
                              } else {
                                setSelectedModifiers(selectedModifiers.filter((id) => id !== modifier.id));
                              }
                            }}
                            className="w-5 h-5 border-2 border-gray-300 rounded-sm text-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-medium uppercase tracking-wider text-black mb-3">
                  Special Instructions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm font-light text-black focus:border-black focus:ring-0 outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Any special requests?"
                />
              </div>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <span className="text-sm uppercase tracking-wider text-gray-600 font-medium">
                  Total
                </span>
                <span className="text-3xl font-light text-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
