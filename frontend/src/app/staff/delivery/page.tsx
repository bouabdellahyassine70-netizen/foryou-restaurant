'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/types/order';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  customerName?: string;
  deliveryAddress?: string;
  phone?: string;
  items: Array<{
    id: string;
    menuItem: { name: string };
    quantity: number;
  }>;
  total: number;
}

export default function DeliveryPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      router.push('/staff/login');
    }
  }, [user, router]);

  // Only fetch READY and DISPATCHED orders (delivery type)
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders', 'delivery'],
    queryFn: async () => {
      const res = await api.get('/orders');
      const allOrders = res.data || [];
      // Filter to only READY and DISPATCHED delivery orders
      return allOrders.filter(
        (o: Order) => 
          o.type === 'DELIVERY' && 
          (o.status === 'READY' || o.status === 'DISPATCHED')
      );
    },
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateDeliveryStatus = (orderId: string, status: OrderStatus) => {
    statusMutation.mutate({ orderId, status });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  const readyOrders = orders.filter(o => o.status === 'READY');
  const dispatchedOrders = orders.filter(o => o.status === 'DISPATCHED');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b-4 border-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">DELIVERY TRACKING</h1>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xl font-bold">
                  Ready: <span className="text-green-400">{readyOrders.length}</span>
                </div>
                <div className="text-xl font-bold">
                  Out: <span className="text-purple-400">{dispatchedOrders.length}</span>
                </div>
              </div>
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

      {/* Delivery Orders Grid */}
      <main className="p-8">
        {isLoading ? (
          <div className="text-center py-40 text-gray-400 text-2xl">Loading deliveries...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-40 text-gray-400 text-2xl">
            No active deliveries
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                onStatusUpdate={updateDeliveryStatus}
                isUpdating={statusMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DeliveryCard({ order, onStatusUpdate, isUpdating }: { 
  order: Order; 
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  isUpdating: boolean;
}) {
  const isDispatched = order.status === 'DISPATCHED';
  const timeReceived = new Date(order.createdAt).toLocaleTimeString();

  return (
    <div className={`bg-gray-800 border-4 p-6 ${isDispatched ? 'border-purple-500' : 'border-green-500'}`}>
      {/* Order Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold font-mono">{order.orderNumber}</span>
          <span className={`px-4 py-2 text-sm font-bold ${
            isDispatched ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {isDispatched ? 'OUT FOR DELIVERY' : 'READY'}
          </span>
        </div>
        <div className="text-sm text-gray-400">{timeReceived}</div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 space-y-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">CUSTOMER:</div>
          <div className="text-lg font-bold">{order.customerName || 'N/A'}</div>
        </div>
        {order.phone && (
          <div>
            <div className="text-xs text-gray-400 mb-1">PHONE:</div>
            <div className="text-lg">{order.phone}</div>
          </div>
        )}
        <div>
          <div className="text-xs text-gray-400 mb-1">ADDRESS:</div>
          <div className="text-base leading-relaxed">{order.deliveryAddress || 'N/A'}</div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-2">ITEMS ({order.items.length}):</div>
        <div className="space-y-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.quantity}x {item.menuItem.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">TOTAL:</span>
        <span className="text-2xl font-bold">${Number(order.total).toFixed(2)}</span>
      </div>

      {/* Action Buttons */}
      {!isDispatched ? (
        <button
          onClick={() => onStatusUpdate(order.id, OrderStatus.DISPATCHED)}
          disabled={isUpdating}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MARK AS OUT FOR DELIVERY
        </button>
      ) : (
        <button
          onClick={() => onStatusUpdate(order.id, OrderStatus.COMPLETED)}
          disabled={isUpdating}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MARK AS DELIVERED
        </button>
      )}
    </div>
  );
}
