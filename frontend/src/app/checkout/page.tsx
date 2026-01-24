'use client';

import { useCartStore } from '@/lib/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { formatPrice } from '@/lib/price';

export default function CheckoutPage() {
  const { items, clearCart, getTotal, getItemCount } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orderType, setOrderType] = useState<'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY');
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const deliveryFee = orderType === 'DELIVERY' ? 20 : 0; // 20 DH for delivery
  const total = subtotal + deliveryFee + tax;

  // Calculate ETA (30 min base + 5 min per item)
  const estimatedMinutes = 30 + (items.length * 5);
  const estimatedTime = new Date(Date.now() + estimatedMinutes * 60000);

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number');
      return;
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      alert('Please provide delivery address');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          modifierIds: item.modifierIds || [],
          notes: item.notes,
        })),
        type: orderType,
        customerName,
        customerPhone,
        notes: specialInstructions,
        deliveryInstructions: orderType === 'DELIVERY' ? deliveryAddress : undefined,
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      router.push(`/orders/${response.data.id}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/" className="text-primary-600 hover:underline">
            Return to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Type</h2>
              <div className="space-y-2">
                <label htmlFor="order-type-takeaway" className="flex items-center">
                  <input
                    id="order-type-takeaway"
                    name="orderType"
                    type="radio"
                    value="TAKEAWAY"
                    checked={orderType === 'TAKEAWAY'}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Takeaway</span>
                </label>
                <label htmlFor="order-type-delivery" className="flex items-center">
                  <input
                    id="order-type-delivery"
                    name="orderType"
                    type="radio"
                    value="DELIVERY"
                    checked={orderType === 'DELIVERY'}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Delivery</span>
                </label>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    id="customer-name"
                    name="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border rounded p-2"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    id="customer-phone"
                    name="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border rounded p-2"
                    autoComplete="tel"
                    required
                  />
                </div>
                {orderType === 'DELIVERY' && (
                  <div>
                    <label htmlFor="delivery-address" className="block text-sm font-medium mb-1">Delivery Address *</label>
                    <textarea
                      id="delivery-address"
                      name="deliveryAddress"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border rounded p-2"
                      rows={3}
                      autoComplete="street-address"
                      required
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="special-instructions" className="block text-sm font-medium mb-1">Special Instructions</label>
                  <textarea
                    id="special-instructions"
                    name="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full border rounded p-2"
                    rows={2}
                    placeholder="Any special requests or allergies..."
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items ({getItemCount()})</h2>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {item.modifiers.map((m) => m.name).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ${((Number(item.price) + (item.modifiers?.reduce((s, m) => s + Number(m.price), 0) || 0)) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* ETA Display */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-primary-900 mb-1">Estimated Time</p>
                <p className="text-2xl font-bold text-primary-600">{estimatedMinutes} min</p>
                <p className="text-xs text-primary-700 mt-1">
                  Ready around {estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !customerName || !customerPhone || (orderType === 'DELIVERY' && !deliveryAddress)}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>

              <Link href="/" className="block text-center text-gray-600 hover:text-gray-900 mt-4 text-sm">
                ← Back to menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
