'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function KitchenPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000');
    setSocket(newSocket);

    newSocket.emit('join-kitchen');

    newSocket.on('order_created', (order: any) => {
      setOrders((prev) => [order, ...prev]);
    });

    newSocket.on('order_status_changed', (order: any) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const { data: initialOrders } = useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: async () => {
      try {
        const res = await api.get('/orders?status=ACCEPTED');
        return res.data || [];
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
      }
    },
  });

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const activeOrders = orders.filter(
    (o) => !['COMPLETED', 'CANCELLED', 'SERVED', 'DISPATCHED'].includes(o.status),
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Kitchen Display System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className={`bg-white text-gray-900 rounded-lg shadow-lg p-6 ${
              order.status === 'READY' ? 'ring-4 ring-green-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">#{order.orderNumber}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-bold ${
                  order.status === 'READY'
                    ? 'bg-green-500 text-white'
                    : order.status === 'PREPARING'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                  </div>
                  {item.modifiers.length > 0 && (
                    <p className="text-sm text-gray-600 ml-4">
                      + {item.modifiers.map((m: any) => m.modifier.name).join(', ')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-red-600 ml-4">Note: {item.notes}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {order.status === 'ACCEPTED' && (
                <button
                  onClick={() => updateStatus(order.id, 'PREPARING')}
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Start
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => updateStatus(order.id, 'READY')}
                  className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
                >
                  Ready
                </button>
              )}
              {order.status === 'READY' && (
                <button
                  onClick={() => updateStatus(order.id, 'SERVED')}
                  className="flex-1 bg-gray-600 text-white py-2 rounded font-semibold hover:bg-gray-700"
                >
                  Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeOrders.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-2xl">No active orders</p>
        </div>
      )}
    </div>
  );
}

