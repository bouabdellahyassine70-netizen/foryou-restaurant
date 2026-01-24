'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminOrderModal } from '@/components/AdminOrderModal';
import { formatPrice } from '@/lib/price';
import { OrderStatus } from '@/types/order';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'users' | 'analytics'>('orders');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check authentication - wait for Zustand to hydrate
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      // Wait a bit for Zustand persist to hydrate
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const authStorage = localStorage.getItem('auth-storage');
        
        // Check auth-storage (Zustand persist format)
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            if (parsed?.state?.user && parsed?.state?.token) {
              const storedUser = parsed.state.user;
              if (storedUser.role === 'ADMIN' || storedUser.role === 'MANAGER') {
                setIsCheckingAuth(false);
                return;
              }
            }
          } catch (e) {
            // Invalid storage - redirect to login
            router.replace('/admin/login');
            return;
          }
        }
        
        // Fallback: check direct localStorage user
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            const parsedUser = JSON.parse(userStr);
            if (parsedUser.role === 'ADMIN' || parsedUser.role === 'MANAGER') {
              setIsCheckingAuth(false);
              return;
            }
          } catch (e) {
            // Invalid user - redirect to login
            router.replace('/admin/login');
            return;
          }
        }
        
        // Not authenticated or invalid role - redirect to login
        router.replace('/admin/login');
      }, 100);
    };
    
    checkAuth();
    
    // Timeout fallback - redirect after 1 second if still checking
    const timeout = setTimeout(() => {
      if (isCheckingAuth) {
        const token = localStorage.getItem('token');
        const authStorage = localStorage.getItem('auth-storage');
        const userStr = localStorage.getItem('user');
        
        // Check if we have valid auth
        let hasValidAuth = false;
        
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            if (parsed?.state?.user && parsed?.state?.token) {
              const storedUser = parsed.state.user;
              if (storedUser.role === 'ADMIN' || storedUser.role === 'MANAGER') {
                hasValidAuth = true;
              }
            }
          } catch (e) {
            // Invalid
          }
        }
        
        if (!hasValidAuth && token && userStr) {
          try {
            const parsedUser = JSON.parse(userStr);
            if (parsedUser.role === 'ADMIN' || parsedUser.role === 'MANAGER') {
              hasValidAuth = true;
            }
          } catch (e) {
            // Invalid
          }
        }
        
        if (!hasValidAuth) {
          router.replace('/admin/login');
        } else {
          setIsCheckingAuth(false);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [router, isCheckingAuth]);

  // If Zustand user is loaded and auth check is done, proceed
  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      setIsCheckingAuth(false);
    }
  }, [user]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5F6368] font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after check, redirect (this should not happen, but safety check)
  if (!user) {
    // This will be handled by useEffect, but show loading briefly
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5F6368] font-light">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight">Admin Dashboard</h1>
            <div className="flex gap-6 items-center">
              <span className="text-sm text-[#5F6368] font-light">Welcome, {user.email}</span>
              <Link href="/" className="text-sm text-[#0A0A0A] hover:text-[#5F6368] transition-colors">
                Menu
            </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/admin/login');
                }}
                className="text-sm text-[#0A0A0A] hover:text-[#5F6368] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-[#E5E7EB] rounded-xl">
          <div className="border-b border-[#E5E7EB]">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                    : 'text-[#5F6368] hover:text-[#0A0A0A]'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                    : 'text-[#5F6368] hover:text-[#0A0A0A]'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                    : 'text-[#5F6368] hover:text-[#0A0A0A]'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
                    : 'text-[#5F6368] hover:text-[#0A0A0A]'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'menu' && <MenuTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}

function OrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const { data: orders, refetch, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
      const res = await api.get('/orders');
        return res.data || [];
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          // Will be handled by interceptor
          return [];
        }
        throw err;
      }
    },
    refetchInterval: 5000,
    retry: 1,
  });

  const handleOrderClick = async (order: any) => {
    try {
      // Fetch full order details
      const response = await api.get(`/orders/${order.id}`);
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Fallback to order from list
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      refetch();
      if (showOrderModal && selectedOrder?.id === orderId) {
        // Refresh the selected order
        const response = await api.get(`/orders/${orderId}`);
        setSelectedOrder(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      console.error('Failed to update status:', error);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { 
        status: 'REJECTED' as OrderStatus,
        rejectedReason: reason 
      });
      refetch();
      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    }
  };

  if (ordersLoading) {
  return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-6">All Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 w-32 mb-4 rounded"></div>
              <div className="h-4 bg-gray-100 w-48 mb-2 rounded"></div>
              <div className="h-4 bg-gray-100 w-24 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">All Orders</h2>
        <div className="card border-red-200 bg-red-50">
          <p className="text-red-600 font-medium mb-2">Error loading orders</p>
          <p className="text-red-500 text-sm mb-4">
            {ordersError instanceof Error ? ordersError.message : 'Failed to fetch orders'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-primary text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">All Orders</h2>
        <p className="text-[#5F6368] font-light">No orders yet. Orders will appear once customers place them.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-6">All Orders</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((order: any) => (
            <div 
              key={order.id} 
              className="card cursor-pointer transition-subtle hover:border-[#0A0A0A] hover:shadow-lg"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex justify-between items-start mb-4">
              <div>
                  <p className="text-heading-2 font-mono text-number mb-1">Order #{order.orderNumber}</p>
                  <p className="text-body-secondary text-sm">
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </p>
              </div>
                <span className={`status-badge ${
                  order.status === 'COMPLETED' || order.status === 'CANCELLED'
                    ? 'status-badge-completed'
                    : order.status === 'PENDING' || order.status === 'CREATED'
                    ? 'status-badge-pending'
                    : 'status-badge-active'
                }`}>
                {order.status}
              </span>
            </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-body">
                  <span className="text-[#5F6368]">Type</span>
                  <span className="font-medium">{order.type}</span>
                </div>
                <div className="flex items-center justify-between text-body">
                  <span className="text-[#5F6368]">Total</span>
                  <span className="font-medium text-number">{formatPrice(order.total)}</span>
                </div>
                {order.items && (
                  <div className="flex items-center justify-between text-body">
                    <span className="text-[#5F6368]">Items</span>
                    <span className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
            </div>
              <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                {order.status === 'CREATED' && (
                  <button
                    onClick={() => updateStatus(order.id, 'CONFIRMED')}
                    className="btn btn-primary text-sm"
                  >
                    Confirm Order
                  </button>
                )}
              {order.status === 'CONFIRMED' && (
                <button
                  onClick={() => updateStatus(order.id, 'ACCEPTED')}
                    className="btn btn-primary text-sm"
                >
                    Accept Order
                </button>
              )}
              {order.status === 'ACCEPTED' && (
                <button
                  onClick={() => updateStatus(order.id, 'PREPARING')}
                    className="btn btn-primary text-sm"
                >
                  Start Preparing
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => updateStatus(order.id, 'READY')}
                    className="btn btn-primary text-sm"
                >
                  Mark Ready
                </button>
              )}
                {order.status === 'READY' && (
                  <button
                    onClick={() => updateStatus(order.id, 'SERVED')}
                    className="btn btn-primary text-sm"
                  >
                    Mark Served
                  </button>
                )}
                {order.status === 'SERVED' && (
                  <button
                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                    className="btn btn-primary text-sm"
                  >
                    Complete Order
                  </button>
                )}
                {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                  <button
                    onClick={() => updateStatus(order.id, 'CANCELLED')}
                    className="btn btn-secondary text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
          </div>
        ))}
      </div>
    </div>

      {showOrderModal && selectedOrder && (
        <AdminOrderModal
          order={selectedOrder}
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onStatusChange={(orderId, status) => updateStatus(orderId, status as string)}
          onReject={handleRejectOrder}
          isUpdating={false}
        />
      )}
    </>
  );
}

function MenuTab() {
  const [activeSection, setActiveSection] = useState<'categories' | 'modifiers'>('categories');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingModifier, setEditingModifier] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/menu/categories');
      return res.data || [];
    },
  });

  const { data: items, refetch: refetchItems } = useQuery({
    queryKey: ['admin-items'],
    queryFn: async () => {
      const res = await api.get('/menu/items');
      return res.data || [];
    },
  });

  // Auto-expand all categories by default when they load
  useEffect(() => {
    if (categories && categories.length > 0 && expandedCategories.size === 0) {
      const allCategoryIds = new Set<string>(categories.map((cat: any) => cat.id));
      setExpandedCategories(allCategoryIds);
    }
  }, [categories, expandedCategories.size]);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/menu/categories/${id}`);
      refetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/menu/items/${id}`);
      refetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleToggleItemAvailability = async (item: any) => {
    try {
      await api.patch(`/menu/items/${item.id}`, {
        isAvailable: !item.isAvailable,
      });
      refetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update availability');
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateItemInCategory = (categoryId: string) => {
    setEditingItem({ categoryId });
    setShowItemModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-4 border-b border-[#E5E7EB]">
        <button
          onClick={() => setActiveSection('categories')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeSection === 'categories'
              ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
              : 'text-[#5F6368] hover:text-[#0A0A0A]'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveSection('modifiers')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeSection === 'modifiers'
              ? 'border-b-2 border-[#0A0A0A] text-[#0A0A0A]'
              : 'text-[#5F6368] hover:text-[#0A0A0A]'
          }`}
        >
          Modifiers
        </button>
      </div>

      {/* Categories with Items Section */}
      {activeSection === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#0A0A0A]">Menu</h2>
            <button
              onClick={handleCreateCategory}
              className="btn btn-primary"
            >
              + Add Category
            </button>
          </div>
          <div className="space-y-6">
            {categories?.map((category: any) => {
              const categoryItems = items?.filter((item: any) => item.categoryId === category.id) || [];
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <div key={category.id} className="card">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-[#0A0A0A]">{category.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${category.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-[#5F6368]">
                          {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-[#5F6368]">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateItemInCategory(category.id)}
                        className="btn btn-secondary text-sm"
                      >
                        + Add Item
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="btn btn-secondary text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn text-sm px-4 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
                      {categoryItems.length === 0 ? (
                        <div className="text-center py-8 text-[#5F6368] text-sm">
                          No items in this category yet.
                          <button
                            onClick={() => handleCreateItemInCategory(category.id)}
                            className="block mx-auto mt-2 text-blue-600 hover:underline"
                          >
                            Add first item
                          </button>
                        </div>
                      ) : (
                        categoryItems.map((item: any) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="text-base font-medium text-[#0A0A0A] mb-1">{item.name}</h4>
                                  {item.description && (
                                    <p className="text-sm text-[#5F6368] line-clamp-2">{item.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                  <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${item.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                  </span>
                                  <span className="text-base font-semibold text-[#0A0A0A] whitespace-nowrap">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="btn btn-secondary text-xs py-1.5 px-3"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleItemAvailability(item)}
                                  className="btn text-xs py-1.5 px-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                  {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="btn text-xs py-1.5 px-3 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modifiers Section */}
      {activeSection === 'modifiers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#0A0A0A]">Modifiers</h2>
            <button
              onClick={() => {
                setEditingModifier(null);
                setShowModifierModal(true);
              }}
              className="btn btn-primary"
            >
              + Add Modifier
            </button>
          </div>
          <div className="text-[#5F6368] font-light">
            Modifiers management - Group by menu item
            <div className="mt-4 space-y-4">
              {items?.map((item: any) => {
                const itemModifiers = item.modifiers || [];
                if (itemModifiers.length === 0) return null;
                return (
                  <div key={item.id} className="card">
                    <h3 className="font-medium text-[#0A0A0A] mb-4">{item.name}</h3>
                    <div className="space-y-2">
                      {itemModifiers.map((modifier: any) => (
                        <div key={modifier.id} className="flex justify-between items-center">
                          <span className="text-sm">{modifier.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{formatPrice(modifier.price)}</span>
                            <button
                              onClick={async () => {
                                setEditingModifier({ ...modifier, menuItemId: item.id });
                                setShowModifierModal(true);
                              }}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Delete this modifier?')) return;
                                try {
                                  await api.patch(`/menu/modifiers/${modifier.id}`, { isActive: false });
                                  refetchItems();
                                } catch (error: any) {
                                  alert('Failed to delete modifier');
                                }
                              }}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          categories={categories || []}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            refetchCategories();
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Item Modal */}
      {showItemModal && (
        <ItemModal
          item={editingItem}
          categories={categories || []}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
          onSave={() => {
            refetchItems();
            refetchCategories();
            setShowItemModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Modifier Modal */}
      {showModifierModal && (
        <ModifierModal
          modifier={editingModifier}
          items={items || []}
          onClose={() => {
            setShowModifierModal(false);
            setEditingModifier(null);
          }}
          onSave={() => {
            refetchItems();
            setShowModifierModal(false);
            setEditingModifier(null);
          }}
        />
      )}
    </div>
  );
}

function UsersTab() {
  return (
    <div className="text-[#5F6368] font-light">
      User management coming soon...
    </div>
  );
}

// Image Upload Component
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${response.data.url}`;
      onChange(imageUrl);
      setPreview(imageUrl);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Image</label>
      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-[#E5E7EB]"
          />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="flex-1 text-sm text-[#5F6368] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-900 file:cursor-pointer"
        />
      </div>
      <input
        type="url"
        placeholder="Or enter image URL"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPreview(e.target.value || null);
        }}
        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
      />
      {uploading && <p className="text-xs text-[#5F6368]">Uploading...</p>}
    </div>
  );
}

// Category Modal Component
function CategoryModal({ category, categories, onClose, onSave }: { category: any; categories: any[]; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    displayOrder: category?.displayOrder || categories.length,
    isActive: category?.isActive !== false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (category) {
        await api.patch(`/menu/categories/${category.id}`, formData);
      } else {
        await api.post('/menu/categories', formData);
      }
      onSave();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#0A0A0A]">
            {category ? 'Edit Category' : 'Create Category'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
            />
          </div>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-[#0A0A0A]">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 btn btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Item Modal Component
function ItemModal({ item, categories, onClose, onSave }: { item: any; categories: any[]; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price ? Number(item.price) : 0,
    image: item?.image || '',
    categoryId: item?.categoryId || categories[0]?.id || '',
    displayOrder: item?.displayOrder || 0,
    isAvailable: item?.isAvailable !== false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (item) {
        await api.patch(`/menu/items/${item.id}`, formData);
      } else {
        await api.post('/menu/items', formData);
      }
      onSave();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#0A0A0A]">
            {item ? 'Edit Menu Item' : 'Create Menu Item'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Price (MAD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-[#0A0A0A]">Available</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 btn btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modifier Modal Component
function ModifierModal({ modifier, items, onClose, onSave }: { modifier: any; items: any[]; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: modifier?.name || '',
    price: modifier?.price ? Number(modifier.price) : 0,
    menuItemId: modifier?.menuItemId || items[0]?.id || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modifier) {
        await api.patch(`/menu/modifiers/${modifier.id}`, formData);
      } else {
        await api.post('/menu/modifiers', formData);
      }
      onSave();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save modifier');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#0A0A0A]">
            {modifier ? 'Edit Modifier' : 'Create Modifier'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Menu Item *</label>
            <select
              required
              value={formData.menuItemId}
              onChange={(e) => setFormData({ ...formData, menuItemId: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Price (MAD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 btn btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/orders/analytics');
      return res.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return <div className="text-[#5F6368] font-light">Loading analytics...</div>;
  if (!analytics) return <div className="text-[#5F6368] font-light">No data available</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#0A0A0A] mb-6">Analytics Dashboard</h2>
      
      {/* Daily Sales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-[#5F6368] mb-2">Today's Sales</h3>
          <p className="text-3xl font-semibold text-[#0A0A0A]">{formatPrice(analytics.todaySales || 0)}</p>
          <p className="text-sm text-[#5F6368] font-light mt-1">{analytics.todayOrders || 0} orders</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-[#5F6368] mb-2">This Week</h3>
          <p className="text-3xl font-semibold text-[#0A0A0A]">{formatPrice(analytics.weekSales || 0)}</p>
          <p className="text-sm text-[#5F6368] font-light mt-1">{analytics.weekOrders || 0} orders</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-[#5F6368] mb-2">Average Order</h3>
          <p className="text-3xl font-semibold text-[#0A0A0A]">{formatPrice(analytics.avgOrder || 0)}</p>
        </div>
      </div>

      {/* Popular Items */}
      <div className="card">
        <h3 className="text-lg font-semibold text-[#0A0A0A] mb-4">Popular Items</h3>
        <div className="space-y-2">
          {analytics.popularItems?.slice(0, 10).map((item: any, index: number) => (
            <div key={item.id} className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
              <span className="font-medium text-[#0A0A0A]">
                {index + 1}. {item.name}
              </span>
              <span className="text-[#5F6368] font-light">{item.count} orders</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rush Hours */}
      <div className="card">
        <h3 className="text-lg font-semibold text-[#0A0A0A] mb-4">Peak Hours</h3>
        <div className="space-y-2">
          {analytics.rushHours?.map((hour: any) => (
            <div key={hour.hour} className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
              <span className="font-medium text-[#0A0A0A]">{hour.hour}:00</span>
              <span className="text-[#5F6368] font-light">{hour.count} orders</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
