'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { formatPrice, formatPriceDecimal } from '@/lib/price';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderId}`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!orderId) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000');
    setSocket(newSocket);

    newSocket.emit('join-order', orderId);

    newSocket.on('order_status_changed', (updatedOrder: any) => {
      if (updatedOrder.id === orderId) {
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      }
    });

    return () => {
      newSocket.close();
    };
  }, [orderId, queryClient]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-[#5F6368] text-body">Loading order...</div>
      </div>
    );
  }

  // Professional Timeline Steps
  const statusSteps = [
    { 
      key: 'CREATED', 
      label: 'Order Received', 
      icon: '○',
      description: 'Your order has been received and is being processed',
      completedIcon: '✓'
    },
    { 
      key: 'CONFIRMED', 
      label: 'Confirmed', 
      icon: '○',
      description: 'Restaurant has confirmed your order',
      completedIcon: '✓'
    },
    { 
      key: 'PREPARING', 
      label: 'In Preparation', 
      icon: '○',
      description: 'Kitchen is preparing your order',
      completedIcon: '✓'
    },
    { 
      key: 'READY', 
      label: order.type === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup', 
      icon: '○',
      description: order.type === 'DELIVERY' ? 'Your order is on the way' : 'Your order is ready',
      completedIcon: '✓'
    },
    { 
      key: 'COMPLETED', 
      label: 'Completed', 
      icon: '○',
      description: 'Order delivered successfully',
      completedIcon: '✓'
    },
  ];

  // Calculate ETA (30 min base + 5 min per item)
  const estimatedMinutes = 30 + (order.items?.length || 0) * 5;
  const deliveryFee = Number(order.deliveryFee || (order.type === 'DELIVERY' ? 20 : 0));

  const getCurrentStepIndex = () => {
    const statusOrder = ['CREATED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
    const index = statusOrder.indexOf(order.status);
    if (index === -1) {
      if (order.status === 'PENDING') return 0;
      if (order.status === 'REJECTED' || order.status === 'CANCELLED') return -1;
      if (order.status === 'DISPATCHED') return 3; // Map to READY step
      if (order.status === 'SERVED') return 3; // Map to READY step
      return 0;
    }
    return index;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Order Header */}
        <div className="mb-10">
          <div className="text-body-secondary mb-2">Order Number</div>
          <h1 className="text-display font-mono text-number mb-3">{order.orderNumber}</h1>
          <div className="flex items-center gap-4 text-body-secondary">
            <span>{order.type}</span>
            <span>•</span>
            <span>{new Date(order.createdAt).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>

        {order.status === 'CANCELLED' || order.status === 'REJECTED' ? (
          /* Rejected State */
          <div className="card mb-8">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F9FA] border-2 border-[#E5E7EB] mb-4">
                <span className="text-2xl">○</span>
              </div>
              <h2 className="text-heading-1 mb-2 text-[#0A0A0A]">
                {order.status === 'REJECTED' ? 'Order Rejected' : 'Order Cancelled'}
              </h2>
              {order.rejectedReason && (
                <p className="text-body-secondary mt-2">{order.rejectedReason}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Status Timeline */}
            <div className="card mb-8">
              <div className="mb-8">
                <h2 className="text-heading-2 mb-1">Order Status</h2>
                <p className="text-body-secondary">Track your order in real-time</p>
              </div>

              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start">
                      {/* Timeline Icon */}
                      <div className="relative flex-shrink-0 mr-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-subtle ${
                            isCompleted
                              ? 'bg-[#0A0A0A] text-white'
                              : isCurrent
                              ? 'bg-[#0A0A0A] text-white ring-2 ring-[#0A0A0A] ring-offset-2 ring-offset-white'
                              : 'bg-[#F8F9FA] border-2 border-[#E5E7EB] text-[#5F6368]'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {isCompleted ? step.completedIcon : step.icon}
                          </span>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 transition-subtle ${
                              isCompleted ? 'bg-[#0A0A0A]' : 'bg-[#E5E7EB]'
                            }`}
                          />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 pt-1">
                        <h3
                          className={`text-heading-2 mb-1 transition-subtle ${
                            isCurrent
                              ? 'text-[#0A0A0A]'
                              : isCompleted
                              ? 'text-[#0A0A0A]'
                              : 'text-[#5F6368]'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {(isCurrent || isCompleted) && step.description && (
                          <p
                            className={`text-body-secondary transition-subtle ${
                              isCurrent ? 'text-[#0A0A0A]' : ''
                            }`}
                          >
                            {step.description}
                          </p>
                        )}
                        {isCurrent && index === 3 && order.type === 'DELIVERY' && (
                          <p className="text-body-secondary mt-2">
                            Estimated arrival: {estimatedMinutes} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Order Items */}
              <div className="lg:col-span-2 card">
                <h2 className="text-heading-2 mb-6">Order Items</h2>
                <div className="space-subsection">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-start justify-between pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="text-body font-medium mb-1">
                          {item.quantity}x {item.menuItem?.name || 'Item'}
                        </div>
                        {item.notes && (
                          <div className="text-body-secondary text-sm mt-1">{item.notes}</div>
                        )}
                      </div>
                      <div className="text-body font-medium text-number ml-4">
                        {formatPrice((Number(item.price) || 0) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="card">
                <h2 className="text-heading-2 mb-6">Summary</h2>
                <div className="space-subsection">
                  <div className="flex justify-between text-body">
                    <span className="text-[#5F6368]">Subtotal</span>
                    <span className="text-number">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-body">
                      <span className="text-[#5F6368]">Delivery Fee</span>
                      <span className="text-number">{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between text-body">
                      <span className="text-[#5F6368]">Tax</span>
                      <span className="text-number">{formatPrice(order.tax || 0)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-body text-[#5F6368]">
                      <span>Discount</span>
                      <span className="text-number">-{formatPrice(order.discount || 0)}</span>
                    </div>
                  )}
                  <div className="divider" />
                  <div className="flex justify-between text-heading-2 text-number">
                    <span>Total</span>
                    <span>{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {order.type === 'DELIVERY' && order.deliveryAddress && (
              <div className="card">
                <h2 className="text-heading-2 mb-4">Delivery Information</h2>
                <div className="space-subsection">
                  <div>
                    <div className="text-body-secondary text-sm mb-1">Address</div>
                    <div className="text-body">{order.deliveryAddress}</div>
                  </div>
                  {order.user?.phone && (
                    <div>
                      <div className="text-body-secondary text-sm mb-1">Contact Number</div>
                      <div className="text-body">{order.user.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
