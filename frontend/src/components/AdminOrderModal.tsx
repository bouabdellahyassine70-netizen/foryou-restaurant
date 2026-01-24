'use client';

import { useState } from 'react';
import { formatPrice, formatPriceDecimal } from '@/lib/price';
import Image from 'next/image';
import { OrderStatus, OrderStatusEnum } from '@/types/order';

interface OrderItem {
  id: string;
  menuItem: {
    id: string;
    name: string;
    description?: string;
    image?: string | null;
    price: number | string;
  };
  quantity: number;
  price: number | string;
  notes?: string;
  modifiers?: Array<{
    id: string;
    modifier: {
      id: string;
      name: string;
      price: number | string;
    };
  }>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: string;
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  customerPhone?: string;
  phone?: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  items: OrderItem[];
  notes?: string;
  isVoiceOrder?: boolean;
  voiceOrderId?: string;
  subtotal: number | string;
  tax?: number | string;
  discount?: number | string;
  total: number | string;
  paymentStatus: string;
  paymentMethod?: string;
  rejectedReason?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  digitalReceipt?: boolean;
  packagingPreference?: string;
  includeCutlery?: boolean;
  priorityStatus?: string;
  estimatedPrepTime?: number;
}

interface AdminOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onReject: (orderId: string, reason: string) => void;
  isUpdating: boolean;
}

export function AdminOrderModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onReject,
  isUpdating,
}: AdminOrderModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen) return null;

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'CREATED':
      case 'PENDING':
        return ['CONFIRMED'];
      case 'CONFIRMED':
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
  const deliveryFee = order.type === 'DELIVERY' ? 20 : 0; // 20 DH delivery fee
  const subtotal = Number(order.subtotal) || 0;
  const tax = Number(order.tax) || 0;
  const discount = Number(order.discount) || 0;

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(order.id, rejectReason);
    setShowRejectForm(false);
    setRejectReason('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white text-[#0A0A0A] max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-xl border border-[#E5E7EB] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#F8F9FA] border-b border-[#E5E7EB] p-8 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-heading-1 font-mono text-number">{order.orderNumber}</h2>
                <span className={`status-badge ${
                  order.status === 'PENDING' || order.status === 'CREATED' 
                    ? 'status-badge-pending' 
                    : order.status === 'COMPLETED' || order.status === 'CANCELLED'
                    ? 'status-badge-completed'
                    : 'status-badge-active'
                }`}>
                  {order.status}
                </span>
                {order.isVoiceOrder && (
                  <span className="status-badge-pending text-xs">AI ORDER</span>
                )}
                <span className="status-badge-pending text-xs uppercase">{order.type}</span>
              </div>
              <div className="text-body-secondary text-sm">
                {new Date(order.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#5F6368] hover:text-[#0A0A0A] text-3xl font-light transition-subtle"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer Information */}
          <div className="card">
            <h3 className="text-heading-2 mb-6">Customer Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-body-secondary text-sm mb-2">Name</div>
                <div className="text-body font-medium">
                  {order.customerName || 
                   (order.user?.firstName && order.user?.lastName 
                     ? `${order.user.firstName} ${order.user.lastName}`.trim()
                     : null) ||
                   order.user?.firstName ||
                   order.user?.email ||
                   'Guest Order'}
                </div>
              </div>
              {(order.customerPhone || order.phone || order.user?.phone) ? (
                <div>
                  <div className="text-body-secondary text-sm mb-2">Phone</div>
                  <a 
                    href={`tel:${(order.customerPhone || order.phone || order.user?.phone || '').trim()}`}
                    className="text-body font-medium text-[#0A0A0A] hover:underline"
                    onClick={(e) => {
                      const phone = (order.customerPhone || order.phone || order.user?.phone || '').trim();
                      if (!phone || phone === 'null' || phone === 'undefined') {
                        e.preventDefault();
                      }
                    }}
                  >
                    {order.customerPhone || order.phone || order.user?.phone}
                  </a>
                </div>
              ) : (
                <div>
                  <div className="text-body-secondary text-sm mb-2">Phone</div>
                  <div className="text-body text-[#5F6368]">Not provided</div>
                </div>
              )}
              {order.user?.email && (
                <div>
                  <div className="text-body-secondary text-sm mb-2">Email</div>
                  <div className="text-body font-medium break-all">{order.user.email}</div>
                </div>
              )}
              {(order.deliveryAddress || order.deliveryInstructions) && (
                <div className="col-span-2">
                  <div className="text-body-secondary text-sm mb-2">Delivery Address</div>
                  <div className="text-body whitespace-pre-line">{order.deliveryAddress || order.deliveryInstructions}</div>
                </div>
              )}
              {order.deliveryInstructions && (
                <div className="col-span-2">
                  <div className="text-body-secondary text-sm mb-2">Delivery Instructions</div>
                  <div className="text-body">{order.deliveryInstructions}</div>
                </div>
              )}
              <div>
                <div className="text-body-secondary text-sm mb-2">Payment Status</div>
                <div className={`text-body font-medium ${
                  order.paymentStatus === 'PAID' ? 'text-[#0A0A0A]' : 'text-[#5F6368]'
                }`}>
                  {order.paymentStatus} {order.paymentMethod ? `(${order.paymentMethod})` : ''}
                </div>
              </div>
              {order.priorityStatus && (
                <div>
                  <div className="text-body-secondary text-sm mb-2">Priority</div>
                  <div className="text-body font-medium uppercase">{order.priorityStatus}</div>
                </div>
              )}
              {order.estimatedPrepTime && (
                <div>
                  <div className="text-body-secondary text-sm mb-2">Estimated Prep Time</div>
                  <div className="text-body font-medium">{order.estimatedPrepTime} minutes</div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h3 className="text-heading-2 mb-6">Order Items ({order.items.length})</h3>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                  {item.menuItem.image && 
                   item.menuItem.image.trim() !== '' && 
                   item.menuItem.image !== 'null' && 
                   item.menuItem.image !== 'undefined' && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#F8F9FA] border border-[#E5E7EB] flex-shrink-0">
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.name || 'Menu item'}
                        fill
                        className="object-cover"
                        sizes="96px"
                        onError={(e) => {
                          // Hide image on error
                          const target = e.target as HTMLImageElement;
                          if (target) {
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-body font-medium mb-1">{item.menuItem.name}</div>
                        {item.menuItem.description && (
                          <div className="text-body-secondary text-sm mb-2">{item.menuItem.description}</div>
                        )}
                        <div className="text-body-secondary text-sm">Quantity: {item.quantity}</div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-body-secondary text-xs mb-1">Modifiers:</div>
                            {item.modifiers.map((mod) => (
                              <div key={mod.id} className="text-body-secondary text-sm">
                                • {mod.modifier.name} {mod.modifier.price ? `(+${formatPrice(mod.modifier.price)})` : ''}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-body font-medium text-number ml-4 flex-shrink-0">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </div>
                    </div>
                    <div className="text-body-secondary text-xs mt-1">
                      Unit price: {formatPrice(item.price)} × {item.quantity}
                    </div>
                    {item.notes && (
                      <div className="mt-3 p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-body-secondary text-sm">
                        📝 <strong>Item Note:</strong> {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {order.notes && (
              <div className="mt-6 p-4 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
                <div className="text-body-secondary text-sm mb-1"><strong>Order Notes:</strong></div>
                <div className="text-body">{order.notes}</div>
              </div>
            )}
            {/* Eco-friendly Options */}
            {(order.digitalReceipt !== undefined || order.packagingPreference || order.includeCutlery !== undefined) && (
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="text-body-secondary text-sm mb-3 font-medium">Preferences</div>
                <div className="space-y-2 text-body-secondary text-sm">
                  {order.digitalReceipt && <div>✓ Digital receipt requested</div>}
                  {order.packagingPreference && <div>✓ Packaging: {order.packagingPreference}</div>}
                  {order.includeCutlery === false && <div>✓ No cutlery requested</div>}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card">
            <h3 className="text-heading-2 mb-6">Order Summary</h3>
            <div className="space-subsection">
              <div className="flex justify-between text-body">
                <span className="text-[#5F6368]">Subtotal</span>
                <span className="text-number">{formatPrice(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-body">
                  <span className="text-[#5F6368]">Delivery Fee</span>
                  <span className="text-number">{formatPrice(deliveryFee)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-body">
                  <span className="text-[#5F6368]">Tax</span>
                  <span className="text-number">{formatPrice(tax)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-body text-[#5F6368]">
                  <span>Discount</span>
                  <span className="text-number">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="divider" />
              <div className="flex justify-between text-heading-2 text-number">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="text-heading-2 mb-6">Actions</h3>
            {order.status === 'PENDING' || order.status === 'CREATED' ? (
              <div className="space-y-4">
                {!showRejectForm ? (
                  <>
                    <button
                      onClick={() => onStatusChange(order.id, 'CONFIRMED' as OrderStatus)}
                      disabled={isUpdating}
                      className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={isUpdating}
                      className="btn btn-secondary w-full border-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Reject Order
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      id="reject-reason"
                      name="rejectReason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      className="input"
                      rows={3}
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleReject}
                        disabled={isUpdating || !rejectReason.trim()}
                        className="btn btn-secondary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectReason('');
                        }}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(order.id, status)}
                    disabled={isUpdating}
                    className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
