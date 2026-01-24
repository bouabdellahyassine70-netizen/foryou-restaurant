'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/types/order';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: string;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  items: Array<{
    id: string;
    menuItem: { name: string };
    quantity: number;
  }>;
  total: number;
  paymentStatus: string;
  isVoiceOrder?: boolean;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  CREATED: 'bg-gray-700',
  PENDING: 'bg-yellow-600',
  CONFIRMED: 'bg-blue-600',
  REJECTED: 'bg-red-700',
  ACCEPTED: 'bg-green-600',
  PREPARING: 'bg-orange-600',
  READY: 'bg-green-500',
  DISPATCHED: 'bg-purple-600',
  SERVED: 'bg-gray-500',
  COMPLETED: 'bg-gray-800',
  CANCELLED: 'bg-red-800',
  PAID: 'bg-green-700',
  REFUNDED: 'bg-red-900',
};

export default function HistoryPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      router.push('/staff/login');
    }
  }, [user, router]);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders', 'history', selectedStatus, selectedType, selectedDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      const res = await api.get(`/orders?${params.toString()}`);
      let filtered = res.data || [];
      
      // Filter by type
      if (selectedType !== 'ALL') {
        filtered = filtered.filter((o: Order) => o.type === selectedType);
      }
      
      // Filter by date
      if (selectedDate) {
        const filterDate = new Date(selectedDate);
        filtered = filtered.filter((o: Order) => {
          const orderDate = new Date(o.createdAt);
          return orderDate.toDateString() === filterDate.toDateString();
        });
      }
      
      // Sort by most recent first
      return filtered.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">ORDER HISTORY</h1>
            <button
              onClick={() => router.push('/staff')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm"
            >
              DASHBOARD
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filter-status" className="block text-xs text-gray-400 mb-2">STATUS:</label>
            <select
              id="filter-status"
              name="filterStatus"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'ALL')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="block text-xs text-gray-400 mb-2">TYPE:</label>
            <select
              id="filter-type"
              name="filterType"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="DINE_IN">DINE IN</option>
              <option value="TAKEOUT">TAKEOUT</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-date" className="block text-xs text-gray-400 mb-2">DATE:</label>
            <input
              id="filter-date"
              name="filterDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <main className="p-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading history...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No orders found matching filters
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 font-mono text-sm font-bold">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.type}</td>
                    <td className="px-4 py-3">
                      <span className={`${STATUS_COLORS[order.status]} text-white px-2 py-1 text-xs font-bold`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.customerName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.isVoiceOrder ? (
                        <span className="bg-purple-700 text-white px-2 py-1 text-xs font-bold">AI</span>
                      ) : (
                        <span className="text-gray-400">WEB</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
