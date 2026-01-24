'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function LoginRedirect() {
  useEffect(() => {
    // Immediate redirect to admin login
    window.location.href = '/admin/login';
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 font-light">Redirecting to login...</p>
      </div>
    </div>
  );
}
