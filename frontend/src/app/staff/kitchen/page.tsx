'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { OrderStatus, OrderStatusEnum } from '@/types/order';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: Array<{
    id: string;
    menuItem: { name: string };
    quantity: number;
    notes?: string;
  }>;
  notes?: string;
}

export default function KitchenPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      router.push('/staff/login');
    }
  }, [user, router]);

  // Only fetch confirmed and preparing orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders', 'kitchen'],
    queryFn: async () => {
      const res = await api.get('/orders');
      const allOrders = res.data || [];
      // Filter to only CONFIRMED, ACCEPTED, and PREPARING orders
      return allOrders.filter(
        (o: Order) => o.status === 'CONFIRMED' || o.status === 'ACCEPTED' || o.status === 'PREPARING'
      );
    },
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const markReady = (orderId: string) => {
    statusMutation.mutate({ orderId, status: OrderStatusEnum.READY });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  // Sort orders: PREPARING first, then by time
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'PREPARING' && b.status !== 'PREPARING') return -1;
    if (b.status === 'PREPARING' && a.status !== 'PREPARING') return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b-4 border-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">KITCHEN VIEW</h1>
            <div className="flex items-center gap-6">
              <div className="text-2xl font-mono">{new Date().toLocaleTimeString()}</div>
              <button
                onClick={() => router.push('/staff')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold"
              >
                DASHBOARD
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <main className="p-8">
        {isLoading ? (
          <div className="text-center py-40 text-gray-400 text-2xl">Loading kitchen orders...</div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-40 text-gray-400 text-2xl">
            No active kitchen orders
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {sortedOrders.map((order) => (
              <KitchenTicket key={order.id} order={order} onReady={markReady} isUpdating={statusMutation.isPending} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function KitchenTicket({ order, onReady, isUpdating }: { 
  order: Order; 
  onReady: (orderId: string) => void;
  isUpdating: boolean;
}) {
  const timeReceived = new Date(order.createdAt).toLocaleTimeString();
  const isPreparing = order.status === 'PREPARING';

  return (
    <div className={`bg-gray-800 border-4 p-6 ${isPreparing ? 'border-orange-500' : 'border-gray-700'}`}>
      {/* Order Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold font-mono">{order.orderNumber}</span>
          {isPreparing && (
            <span className="bg-orange-600 text-white px-4 py-2 text-sm font-bold">PREPARING</span>
          )}
        </div>
        <div className="text-lg text-gray-400">{timeReceived}</div>
      </div>

      {/* Items List */}
      <div className="mb-6 space-y-4">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Items:
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="pb-3 border-b border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold">{item.quantity}x</span>
              <span className="text-xl font-bold text-right flex-1 ml-4">{item.menuItem.name}</span>
            </div>
            {item.notes && (
              <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-700 text-yellow-200 text-sm">
                📝 {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="mb-6 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-200">
          <div className="text-sm font-bold mb-1">Order Notes:</div>
          <div className="text-sm">{order.notes}</div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onReady(order.id)}
        disabled={isUpdating || isPreparing === false}
        className="w-full bg-green-600 hover:bg-green-500 text-white py-6 text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {order.status === 'PREPARING' ? 'MARK AS READY' : 'START PREPARING'}
      </button>
    </div>
  );
}
