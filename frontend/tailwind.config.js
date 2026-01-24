/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#D97706',
          'primary-dark': '#B45309',
          'primary-light': '#FCD34D',
          secondary: '#0EA5E9',
          'secondary-dark': '#0284C7',
          'secondary-light': '#E0F2FE',
        },
        status: {
          success: '#10B981',
          'success-bg': '#D1FAE5',
          'success-text': '#065F46',
          warning: '#F59E0B',
          'warning-bg': '#FEF3C7',
          'warning-text': '#92400E',
          error: '#EF4444',
          'error-bg': '#FEE2E2',
          'error-text': '#991B1B',
          info: '#3B82F6',
          'info-bg': '#DBEAFE',
          'info-text': '#1E40AF',
          neutral: '#6B7280',
          'neutral-bg': '#F3F4F6',
          'neutral-text': '#374151',
        },
        // Legacy support
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        primary: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'client-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'client-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'client-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'client-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'admin-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        'admin-md': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'admin-lg': '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

