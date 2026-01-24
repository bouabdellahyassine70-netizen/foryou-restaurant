'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface RestaurantSettings {
  isOpen: boolean;
  deliveryEnabled: boolean;
  aiOrdersEnabled: boolean;
  serviceMode: 'ALL' | 'DELIVERY_ONLY' | 'TAKEOUT_ONLY';
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<RestaurantSettings>({
    isOpen: true,
    deliveryEnabled: true,
    aiOrdersEnabled: true,
    serviceMode: 'ALL',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      router.push('/staff/login');
    }
    // Only admins and managers can access settings
    if (user && user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      router.push('/staff');
    }
  }, [user, router]);

  // Note: In a real app, you'd fetch settings from an API endpoint
  // For now, we'll use local state

  const updateMutation = useMutation({
    mutationFn: async (newSettings: RestaurantSettings) => {
      // In a real app, this would call an API endpoint
      // For now, we'll just simulate it
      return new Promise((resolve) => setTimeout(() => resolve(newSettings), 500));
    },
    onSuccess: () => {
      alert('Settings saved successfully');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

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
            <h1 className="text-2xl font-bold">ADMIN SETTINGS</h1>
            <button
              onClick={() => router.push('/staff')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm"
            >
              DASHBOARD
            </button>
          </div>
        </div>
      </header>

      {/* Settings Form */}
      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 p-8 space-y-8">
          {/* Restaurant Status */}
          <div>
            <h2 className="text-xl font-bold mb-4">RESTAURANT STATUS</h2>
            <label htmlFor="restaurant-open" className="flex items-center gap-4 cursor-pointer">
              <input
                id="restaurant-open"
                name="isOpen"
                type="checkbox"
                checked={settings.isOpen}
                onChange={(e) => setSettings({ ...settings, isOpen: e.target.checked })}
                className="w-6 h-6 cursor-pointer"
              />
              <span className="text-lg">Restaurant is OPEN</span>
            </label>
            {!settings.isOpen && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-700 text-red-200">
                Restaurant is currently CLOSED. New orders will not be accepted.
              </div>
            )}
          </div>

          {/* Service Mode */}
          <div>
            <h2 className="text-xl font-bold mb-4">SERVICE MODE</h2>
            <div className="space-y-3">
              <label htmlFor="service-mode-all" className="flex items-center gap-4 cursor-pointer">
                <input
                  id="service-mode-all"
                  type="radio"
                  name="serviceMode"
                  value="ALL"
                  checked={settings.serviceMode === 'ALL'}
                  onChange={(e) => setSettings({ ...settings, serviceMode: e.target.value as any })}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg">ALL SERVICES (Dine-in, Takeout, Delivery)</span>
              </label>
              <label htmlFor="service-mode-delivery" className="flex items-center gap-4 cursor-pointer">
                <input
                  id="service-mode-delivery"
                  type="radio"
                  name="serviceMode"
                  value="DELIVERY_ONLY"
                  checked={settings.serviceMode === 'DELIVERY_ONLY'}
                  onChange={(e) => setSettings({ ...settings, serviceMode: e.target.value as any })}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg">DELIVERY ONLY</span>
              </label>
              <label htmlFor="service-mode-takeout" className="flex items-center gap-4 cursor-pointer">
                <input
                  id="service-mode-takeout"
                  type="radio"
                  name="serviceMode"
                  value="TAKEOUT_ONLY"
                  checked={settings.serviceMode === 'TAKEOUT_ONLY'}
                  onChange={(e) => setSettings({ ...settings, serviceMode: e.target.value as any })}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg">TAKEOUT ONLY</span>
              </label>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-bold mb-4">FEATURES</h2>
            <div className="space-y-4">
              <label htmlFor="delivery-enabled" className="flex items-center gap-4 cursor-pointer">
                <input
                  id="delivery-enabled"
                  name="deliveryEnabled"
                  type="checkbox"
                  checked={settings.deliveryEnabled}
                  onChange={(e) => setSettings({ ...settings, deliveryEnabled: e.target.checked })}
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="text-lg">Enable Delivery Orders</span>
              </label>
              <label htmlFor="ai-orders-enabled" className="flex items-center gap-4 cursor-pointer">
                <input
                  id="ai-orders-enabled"
                  name="aiOrdersEnabled"
                  type="checkbox"
                  checked={settings.aiOrdersEnabled}
                  onChange={(e) => setSettings({ ...settings, aiOrdersEnabled: e.target.checked })}
                  className="w-6 h-6 cursor-pointer"
                />
                <span className="text-lg">Enable AI Phone Orders (SAWT IA)</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full bg-white text-gray-900 py-4 text-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
          </div>
        </div>

        {/* Menu Availability Note */}
        <div className="mt-6 bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">MENU AVAILABILITY</h2>
          <p className="text-gray-400 mb-4">
            Menu item availability (on/off) should be managed through the main admin panel at /admin.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm"
          >
            GO TO ADMIN PANEL
          </button>
        </div>
      </main>
    </div>
  );
}
