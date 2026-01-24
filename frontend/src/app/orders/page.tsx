'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/price';
import { OrderStatus } from '@/types/order';
import Link from 'next/link';

export default function FindOrderPage() {
  const router = useRouter();
  const [searchMethod, setSearchMethod] = useState<'orderNumber' | 'phone'>('orderNumber');
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['customer-orders', searchMethod, searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return [];
      
      try {
        const res = await api.get('/orders');
        const allOrders = res.data || [];
        
        // Filter by search criteria
        if (searchMethod === 'orderNumber') {
          return allOrders.filter((order: any) => 
            order.orderNumber?.toLowerCase().includes(searchValue.toLowerCase().trim())
          );
        } else {
          // Search by phone number
          return allOrders.filter((order: any) => {
            const orderPhone = order.customerPhone || order.user?.phone || '';
            return orderPhone.includes(searchValue.trim());
          });
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        throw err;
      }
    },
    enabled: hasSearched && searchValue.trim().length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setHasSearched(true);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-50 text-red-700';
      case 'PREPARING':
      case 'ACCEPTED':
        return 'bg-blue-50 text-blue-700';
      case 'READY':
      case 'DISPATCHED':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<string, string> = {
      CREATED: 'Reçue',
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      ACCEPTED: 'Acceptée',
      PREPARING: 'En préparation',
      READY: 'Prête',
      DISPATCHED: 'En livraison',
      SERVED: 'Servie',
      COMPLETED: 'Terminée',
      CANCELLED: 'Annulée',
      REJECTED: 'Refusée',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-light tracking-tight text-black">
              FOR YOU
            </Link>
            <div className="hidden md:flex items-center gap-12">
              <Link href="/" className="text-sm font-medium text-black uppercase tracking-wide hover:opacity-60 transition-opacity">
                Menu
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black mb-4">
              Retrouver ma commande
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Recherchez votre commande par numéro ou numéro de téléphone
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Method Toggle */}
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod('orderNumber');
                      setSearchValue('');
                      setHasSearched(false);
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      searchMethod === 'orderNumber'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Numéro de commande
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod('phone');
                      setSearchValue('');
                      setHasSearched(false);
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      searchMethod === 'phone'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Numéro de téléphone
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-4">
                  <input
                    type={searchMethod === 'phone' ? 'tel' : 'text'}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setHasSearched(false);
                    }}
                    placeholder={
                      searchMethod === 'orderNumber'
                        ? 'Ex: FY-1234567890-ABC123'
                        : 'Ex: +212 6XX XXX XXX'
                    }
                    className="flex-1 px-6 py-4 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-black text-white rounded-lg font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors whitespace-nowrap"
                  >
                    Rechercher
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results */}
          {hasSearched && (
            <div>
              {isLoading && (
                <div className="text-center py-16">
                  <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-light">Recherche en cours...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700 font-medium mb-2">Erreur lors de la recherche</p>
                  <p className="text-red-600 text-sm">
                    Veuillez réessayer ou vérifier vos informations
                  </p>
                </div>
              )}

              {!isLoading && !error && orders && (
                <>
                  {orders.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                      <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-light text-black mb-2">Aucune commande trouvée</h3>
                      <p className="text-gray-600 font-light">
                        Vérifiez votre {searchMethod === 'orderNumber' ? 'numéro de commande' : 'numéro de téléphone'} et réessayez
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-light text-black mb-6">
                        {orders.length} commande{orders.length > 1 ? 's' : ''} trouvée{orders.length > 1 ? 's' : ''}
                      </h2>
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-black mb-1">
                                Commande {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Type</p>
                              <p className="text-sm font-medium text-black">
                                {order.type === 'DELIVERY' ? 'Livraison' : order.type === 'TAKEAWAY' ? 'À emporter' : 'Sur place'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Total</p>
                              <p className="text-sm font-medium text-black">
                                {formatPrice(order.total || 0)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              {order.items?.length || 0} article{order.items?.length > 1 ? 's' : ''}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/orders/${order.id}`);
                              }}
                              className="text-sm font-medium text-black hover:underline"
                            >
                              Voir les détails →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-xl font-light text-black mb-4">Besoin d'aide ?</h2>
            <div className="space-y-3 text-gray-600 font-light">
              <p>
                • Le numéro de commande se trouve dans votre email de confirmation
              </p>
              <p>
                • Vous pouvez également rechercher avec le numéro de téléphone utilisé lors de la commande
              </p>
              <p>
                • Pour toute question, contactez-nous au{' '}
                <a href="tel:+212612345678" className="text-black hover:underline">
                  +212 6XX XXX XXX
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
