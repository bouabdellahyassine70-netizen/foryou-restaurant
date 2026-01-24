'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, access_token } = response.data;
      
      // Only allow staff roles to login
      if (user.role !== 'ADMIN' && user.role !== 'MANAGER' && user.role !== 'KITCHEN_STAFF' && user.role !== 'WAITER') {
        setError('Access denied. Staff access required.');
        setIsLoading(false);
        return;
      }

      // Store auth before redirect
      setAuth(user, access_token);
      
      // Give Zustand a moment to persist to localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use window.location for reliable redirect
      window.location.href = '/staff';
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-gray-800 border border-gray-700 p-10">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">STAFF POS</h1>
          <p className="text-gray-400 text-center text-sm">Restaurant Operations System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-lg focus:outline-none focus:border-gray-500"
              placeholder="staff@foryou.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-lg focus:outline-none focus:border-gray-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-gray-900 py-4 text-lg font-bold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
        <div className="text-center text-xs text-gray-500">
          Staff access only
        </div>
      </div>
    </div>
  );
}
