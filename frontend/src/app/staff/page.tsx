'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { OrderStatus, OrderStatusEnum } from '@/types/order';
import { formatPrice } from '@/lib/price';
import { AdminOrderModal } from '@/components/AdminOrderModal';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: string;
  createdAt: string;
  customerName?: string;
  phone?: string;
  deliveryAddress?: string;
  items: Array<{
    id: string;
    menuItem: { name: string };
    quantity: number;
    notes?: string;
  }>;
  notes?: string;
  isVoiceOrder?: boolean;
  voiceOrderId?: string;
  total: number;
  paymentStatus: string;
}

// Professional black & white status styling
const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  CREATED: { bg: 'bg-[#F8F9FA]', text: 'text-[#0A0A0A]', border: 'border-[#E5E7EB]' },
  PENDING: { bg: 'bg-[#F8F9FA]', text: 'text-[#0A0A0A]', border: 'border-[#D1D5DB]' },
  CONFIRMED: { bg: 'bg-[#0A0A0A]', text: 'text-white', border: 'border-[#0A0A0A]' },
  REJECTED: { bg: 'bg-[#F8F9FA]', text: 'text-[#5F6368]', border: 'border-[#E5E7EB]' },
  ACCEPTED: { bg: 'bg-[#0A0A0A]', text: 'text-white', border: 'border-[#0A0A0A]' },
  PREPARING: { bg: 'bg-[#0A0A0A]', text: 'text-white', border: 'border-[#0A0A0A]' },
  READY: { bg: 'bg-[#0A0A0A]', text: 'text-white', border: 'border-[#0A0A0A]' },
  DISPATCHED: { bg: 'bg-[#0A0A0A]', text: 'text-white', border: 'border-[#0A0A0A]' },
  SERVED: { bg: 'bg-[#F8F9FA]', text: 'text-[#0A0A0A]', border: 'border-[#E5E7EB]' },
  COMPLETED: { bg: 'bg-[#F8F9FA]', text: 'text-[#5F6368]', border: 'border-[#E5E7EB]' },
  CANCELLED: { bg: 'bg-[#F8F9FA]', text: 'text-[#5F6368]', border: 'border-[#E5E7EB]' },
  PAID: { bg: 'bg-[#F8F9FA]', text: 'text-[#0A0A0A]', border: 'border-[#E5E7EB]' },
  REFUNDED: { bg: 'bg-[#F8F9FA]', text: 'text-[#5F6368]', border: 'border-[#E5E7EB]' },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: 'NEW',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DISPATCHED: 'OUT FOR DELIVERY',
  SERVED: 'SERVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
};

export default function StaffPage() {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    // Check auth - wait a bit for Zustand persist to hydrate
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('auth-storage');
      
      if (!token) {
        router.push('/staff/login');
        return;
      }
      
      // If we have a token but user isn't loaded yet, wait a moment for Zustand to hydrate
      if (!user && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.state?.user) {
            // User exists in storage, just needs time to hydrate
            setTimeout(() => setIsCheckingAuth(false), 100);
            return;
          }
        } catch (e) {
          // Invalid storage, redirect to login
          router.push('/staff/login');
          return;
        }
      }
      
      setIsCheckingAuth(false);
    };

    // Initial check
    checkAuth();
    
    // Also check after a short delay to allow Zustand to hydrate
    const timeout = setTimeout(() => {
      checkAuth();
    }, 200);

    return () => clearTimeout(timeout);
  }, [user, router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders', selectedStatus],
    queryFn: async () => {
      const params = selectedStatus !== 'ALL' ? `?status=${selectedStatus}` : '';
      const res = await api.get(`/orders${params}`);
      return res.data || [];
    },
    refetchInterval: 3000, // Refetch every 3 seconds for real-time feel
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      return api.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Count orders by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  if (isCheckingAuth || (!user && !localStorage.getItem('token'))) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }
  
  if (!user && localStorage.getItem('token')) {
    // Token exists but user not loaded - wait a bit more
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Authenticating...
      </div>
    );
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    statusMutation.mutate({ orderId, status: newStatus });
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    await statusMutation.mutateAsync({ orderId, status: OrderStatusEnum.REJECTED });
    // Update order with rejection reason
    try {
      await api.patch(`/orders/${orderId}/status`, { 
        status: OrderStatusEnum.REJECTED,
        rejectedReason: reason 
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const handleOrderClick = async (order: Order) => {
    // Fetch full order details from API
    try {
      const response = await api.get(`/orders/${order.id}`);
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Fallback to order from list if API fails
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Staff Dashboard</h1>
              <p className="text-body-secondary mt-1">
                {user.email} • {user.role}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => router.push('/staff/kitchen')}
                  className="btn btn-secondary text-sm"
                >
                  Kitchen
                </button>
                <button
                  onClick={() => router.push('/staff/delivery')}
                  className="btn btn-secondary text-sm"
                >
                  Delivery
                </button>
                <button
                  onClick={() => router.push('/staff/history')}
                  className="btn btn-secondary text-sm"
                >
                  History
                </button>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <button
                    onClick={() => router.push('/staff/settings')}
                    className="btn btn-secondary text-sm"
                  >
                    Settings
                  </button>
                )}
              </nav>
              <div className="text-right">
                <div className="text-body font-mono text-number">{currentTime.toLocaleTimeString()}</div>
                <div className="text-body-secondary text-sm">{currentTime.toLocaleDateString()}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/staff/login');
                }}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Counters */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
        <div className="grid grid-cols-7 gap-4">
          {(['CREATED', 'CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((status) => {
            const isSelected = selectedStatus === status;
            const style = STATUS_STYLES[status];
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(isSelected ? 'ALL' : status)}
                className={`card text-center transition-subtle ${
                  isSelected ? 'border-[#0A0A0A] bg-[#F8F9FA]' : 'hover:border-[#D1D5DB]'
                }`}
              >
                <div className={`status-badge ${style.bg} ${style.text} ${style.border} mb-2 text-xs`}>
                  {STATUS_LABELS[status]}
                </div>
                <div className="text-heading-1 text-number">{statusCounts[status] || 0}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      <main className="p-8">
        {isLoading ? (
          <div className="text-center py-20 text-body-secondary">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-body-secondary">
            No orders found for status: {selectedStatus === 'ALL' ? 'ALL' : STATUS_LABELS[selectedStatus]}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onOrderClick={() => handleOrderClick(order)}
                isUpdating={statusMutation.isPending}
              />
            ))}
          </div>
        )}

        {showOrderModal && selectedOrder && (
          <AdminOrderModal
            order={selectedOrder}
            isOpen={showOrderModal}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
            onStatusChange={handleStatusChange}
            onReject={handleRejectOrder}
            isUpdating={statusMutation.isPending}
          />
        )}
      </main>
    </div>
  );
}

function OrderCard({ order, onStatusChange, onOrderClick, isUpdating }: { 
  order: Order; 
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onOrderClick: () => void;
  isUpdating: boolean;
}) {
  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'CREATED':
      case 'PENDING':
        return ['CONFIRMED', 'REJECTED'];
      case 'CONFIRMED':
      case 'ACCEPTED':
        return ['PREPARING'];
      case 'PREPARING':
        return ['READY'];
      case 'READY':
        return order.type === 'DELIVERY' ? ['DISPATCHED'] : ['SERVED', 'COMPLETED'];
      case 'DISPATCHED':
        return ['COMPLETED'];
      case 'SERVED':
        return ['COMPLETED'];
      default:
        return [];
    }
  };

  const nextStatuses = getNextStatuses(order.status);
  const timeReceived = new Date(order.createdAt).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const statusStyle = STATUS_STYLES[order.status];

  return (
    <div 
      className="card cursor-pointer transition-subtle hover:border-[#0A0A0A]"
      onClick={onOrderClick}
    >
      {/* Order Header - Scannable in 1 second */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-heading-2 font-mono text-number">{order.orderNumber}</span>
            {order.isVoiceOrder && (
              <span className="status-badge-pending text-xs">AI</span>
            )}
            <span className="text-body-secondary text-xs uppercase">{order.type}</span>
          </div>
          <div className="text-body-secondary text-sm">{timeReceived}</div>
        </div>
        <div className={`status-badge ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
          {STATUS_LABELS[order.status]}
        </div>
      </div>

      {/* Quick Info - Scannable */}
      <div className="space-y-2 mb-6">
        {order.customerName && (
          <div className="flex items-center justify-between text-body">
            <span className="text-[#5F6368]">Customer</span>
            <span className="font-medium">{order.customerName}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-body">
          <span className="text-[#5F6368]">Payment</span>
          <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-[#0A0A0A]' : 'text-[#5F6368]'}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Items Summary */}
      <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
        <div className="text-body-secondary text-sm mb-2">Items ({order.items.length})</div>
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="text-body text-sm">
              {item.quantity}x {item.menuItem.name}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-body-secondary text-sm">
              +{order.items.length - 3} more
            </div>
          )}
        </div>
        {order.notes && (
          <div className="mt-3 p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded text-body-secondary text-xs">
            📝 {order.notes}
          </div>
        )}
      </div>

      {/* Total - Emphasized */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-body-secondary text-sm">Total</span>
        <span className="text-heading-1 text-number">{formatPrice(order.total)}</span>
      </div>

      {/* Action Buttons */}
      {nextStatuses.length > 0 && (
        <div className="space-y-2">
          {nextStatuses.map((status) => (
            <button
              key={status}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(order.id, status);
              }}
              disabled={isUpdating}
              className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}

      {nextStatuses.length === 0 && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
        <div className="text-center text-body-secondary text-sm py-2">
          No actions available
        </div>
      )}
    </div>
  );
}
