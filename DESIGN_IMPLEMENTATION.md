# Design System Implementation Guide
## Step-by-Step Code Updates

This guide provides concrete code changes to implement the unified design system.

---

## STEP 1: Update CSS Variables (`globals.css`)

Replace the existing `:root` section in `frontend/src/app/globals.css`:

```css
:root {
  /* Brand Colors */
  --brand-primary: #D97706;
  --brand-primary-dark: #B45309;
  --brand-primary-light: #FCD34D;
  --brand-secondary: #0EA5E9;
  --brand-secondary-dark: #0284C7;
  --brand-secondary-light: #E0F2FE;

  /* Client Backgrounds - Warm */
  --bg-client-primary: #FFFFFF;
  --bg-client-secondary: #FEFBF7;
  --bg-client-tertiary: #F9F7F4;

  /* Admin Backgrounds - Cool */
  --bg-admin-primary: #FFFFFF;
  --bg-admin-secondary: #F8F9FA;
  --bg-admin-tertiary: #F1F3F5;

  /* Text Colors */
  --text-primary: #0A0A0A;
  --text-secondary: #5F6368;
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;

  /* Borders */
  --border-light: #E5E7EB;
  --border-medium: #D1D5DB;
  --border-dark: #9CA3AF;
  --border-focus: #D97706;
  --border-focus-admin: #0EA5E9;

  /* Status Colors */
  --status-success: #10B981;
  --status-success-bg: #D1FAE5;
  --status-success-text: #065F46;
  --status-warning: #F59E0B;
  --status-warning-bg: #FEF3C7;
  --status-warning-text: #92400E;
  --status-error: #EF4444;
  --status-error-bg: #FEE2E2;
  --status-error-text: #991B1B;
  --status-info: #3B82F6;
  --status-info-bg: #DBEAFE;
  --status-info-text: #1E40AF;
  --status-neutral: #6B7280;
  --status-neutral-bg: #F3F4F6;
  --status-neutral-text: #374151;

  /* Typography - Client */
  --text-display: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 1.875rem;
  --text-h3: 1.5rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;

  /* Typography - Admin */
  --text-display-admin: 2rem;
  --text-h1-admin: 1.5rem;
  --text-h2-admin: 1.25rem;
  --text-h3-admin: 1.125rem;
  --text-body-admin: 0.875rem;
  --text-body-sm-admin: 0.8125rem;
  --text-caption-admin: 0.75rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows - Client */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Shadows - Admin */
  --shadow-admin-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  --shadow-admin-md: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  --shadow-admin-lg: 0 4px 8px 0 rgba(0, 0, 0, 0.1);

  /* Fonts */
  --font-primary: var(--font-inter), -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}
```

---

## STEP 2: Update Component Classes

Add these component classes to `globals.css` in the `@layer components` section:

```css
@layer components {
  /* Client Side Buttons */
  .btn-primary {
    @apply px-8 py-4 rounded-lg font-semibold text-base;
    background: var(--brand-primary);
    color: var(--text-inverse);
    letter-spacing: 0.02em;
    transition: all 200ms ease;
  }

  .btn-primary:hover {
    background: var(--brand-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    @apply px-8 py-4 rounded-lg font-medium text-base;
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-medium);
    transition: all 200ms ease;
  }

  .btn-secondary:hover {
    background: var(--bg-client-secondary);
    border-color: var(--border-dark);
  }

  /* Admin Side Buttons */
  .btn-admin-primary {
    @apply px-4 py-2 rounded-md font-medium text-sm;
    background: var(--brand-secondary);
    color: var(--text-inverse);
    transition: all 150ms ease;
  }

  .btn-admin-primary:hover {
    background: var(--brand-secondary-dark);
  }

  .btn-admin-secondary {
    @apply px-4 py-2 rounded-md font-medium text-sm;
    background: var(--bg-admin-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    transition: all 150ms ease;
  }

  .btn-admin-secondary:hover {
    background: var(--bg-admin-tertiary);
  }

  .btn-admin-danger {
    @apply px-4 py-2 rounded-md font-medium text-sm;
    background: var(--status-error);
    color: var(--text-inverse);
    transition: all 150ms ease;
  }

  .btn-admin-danger:hover {
    background: #DC2626;
  }

  /* Client Side Cards */
  .card-client {
    @apply bg-white border border-[#E5E7EB] rounded-2xl p-8;
    box-shadow: var(--shadow-sm);
    transition: all 300ms ease;
  }

  .card-client:hover {
    border-color: var(--border-medium);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .card-product {
    @apply bg-white rounded-2xl overflow-hidden;
    box-shadow: var(--shadow-sm);
    transition: all 300ms ease;
  }

  .card-product:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }

  /* Admin Side Cards */
  .card-admin {
    @apply bg-white border border-[#E5E7EB] rounded-xl p-4;
    box-shadow: var(--shadow-admin-sm);
  }

  .card-order {
    @apply bg-white border-l-4 border-[#D1D5DB] rounded-lg p-4;
    transition: all 150ms ease;
  }

  .card-order:hover {
    background: var(--bg-admin-secondary);
    border-left-color: var(--brand-secondary);
  }

  /* Status Badges */
  .badge-status {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase;
    letter-spacing: 0.05em;
  }

  .badge-success {
    background: var(--status-success-bg);
    color: var(--status-success-text);
  }

  .badge-warning {
    background: var(--status-warning-bg);
    color: var(--status-warning-text);
  }

  .badge-error {
    background: var(--status-error-bg);
    color: var(--status-error-text);
  }

  .badge-info {
    background: var(--status-info-bg);
    color: var(--status-info-text);
  }

  .badge-neutral {
    background: var(--status-neutral-bg);
    color: var(--status-neutral-text);
  }

  /* Status Badges - Admin (More Compact) */
  .badge-status-admin {
    @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase;
    letter-spacing: 0.05em;
  }

  /* Inputs */
  .input-client {
    @apply w-full px-4 py-4 border border-[#E5E7EB] rounded-lg text-base;
    background: var(--bg-client-primary);
    transition: all 200ms ease;
  }

  .input-client:focus {
    @apply outline-none;
    border-color: var(--brand-primary);
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
  }

  .input-admin {
    @apply w-full px-3 py-2 border border-[#E5E7EB] rounded-md text-sm;
    background: var(--bg-admin-primary);
    transition: all 150ms ease;
  }

  .input-admin:focus {
    @apply outline-none;
    border-color: var(--brand-secondary);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
  }
}
```

---

## STEP 3: Update Tailwind Config

Update `frontend/tailwind.config.js`:

```javascript
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
```

---

## STEP 4: Client Side Component Updates

### Homepage Hero Section (`page.tsx`)

```tsx
{/* Hero Section - Updated */}
<section className="relative pt-24 pb-32 lg:pb-40 overflow-hidden bg-gradient-to-b from-[#FEFBF7] to-white">
  <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32">
    <div className="max-w-3xl">
      <h1 className="text-[3.5rem] lg:text-[4.5rem] font-light tracking-tight text-[#0A0A0A] mb-6 leading-[1.1]">
        Crafted for Taste.
        <br />
        <span className="font-normal">Delivered with Precision.</span>
      </h1>
      <p className="text-lg lg:text-xl text-[#5F6368] font-light mb-12 leading-relaxed">
        Order delivery or take-out in seconds.
      </p>
      <Link
        href="#menu"
        className="btn-primary inline-block"
      >
        Order Now
      </Link>
    </div>
  </div>
</section>
```

### Product Card (`Menu.tsx`)

```tsx
<div className="card-product group cursor-pointer">
  <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
    {item.image && (
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    )}
  </div>
  <div className="p-6">
    <h3 className="text-2xl font-semibold text-[#0A0A0A] mb-2">{item.name}</h3>
    <p className="text-base text-[#5F6368] mb-4 line-clamp-2">{item.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-xl font-semibold text-[#D97706]">{formatPrice(item.price)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(item);
        }}
        className="btn-secondary text-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

### Navigation Bar

```tsx
<nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] z-50">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">
    <div className="flex items-center justify-between h-20">
      <Link href="/" className="text-2xl font-light tracking-tight text-[#0A0A0A]">
        FOR YOU
      </Link>
      <div className="hidden md:flex items-center gap-12">
        <Link href="/" className="text-sm font-medium text-[#0A0A0A] uppercase tracking-wide hover:text-[#D97706] transition-colors">
          Menu
        </Link>
        {/* ... other links */}
      </div>
    </div>
  </div>
</nav>
```

---

## STEP 5: Admin Side Component Updates

### Order Card (`admin/page.tsx`)

```tsx
<div className={`card-order ${
  order.status === 'PENDING' ? 'border-l-[#F59E0B]' :
  order.status === 'CONFIRMED' ? 'border-l-[#3B82F6]' :
  order.status === 'PREPARING' ? 'border-l-[#7C3AED]' :
  order.status === 'READY' ? 'border-l-[#10B981]' :
  'border-l-[#6B7280]'
}`}>
  <div className="flex items-start justify-between mb-3">
    <div>
      <h3 className="text-lg font-semibold text-[#0A0A0A] mb-1">
        Order #{order.orderNumber}
      </h3>
      <p className="text-sm text-[#5F6368]">
        {order.customerName || order.user?.name || 'Guest'}
      </p>
    </div>
    <span className={`badge-status-admin ${
      order.status === 'COMPLETED' ? 'badge-success' :
      order.status === 'CANCELLED' || order.status === 'REJECTED' ? 'badge-error' :
      order.status === 'PENDING' ? 'badge-warning' :
      'badge-info'
    }`}>
      {order.status}
    </span>
  </div>
  <div className="flex items-center justify-between text-sm">
    <span className="text-[#5F6368]">{formatPrice(order.total)}</span>
    <div className="flex gap-2">
      <button
        onClick={() => handleViewOrder(order)}
        className="btn-admin-secondary text-xs"
      >
        View
      </button>
      {order.status === 'PENDING' && (
        <>
          <button
            onClick={() => handleAcceptOrder(order.id)}
            className="btn-admin-primary text-xs"
          >
            Accept
          </button>
          <button
            onClick={() => handleRejectOrder(order.id)}
            className="btn-admin-danger text-xs"
          >
            Reject
          </button>
        </>
      )}
    </div>
  </div>
</div>
```

### Admin Dashboard Header

```tsx
<div className="bg-white border-b border-[#E5E7EB] px-6 py-4 mb-6">
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-[#0A0A0A]">Orders Dashboard</h1>
    <div className="flex items-center gap-3">
      <select className="input-admin text-sm w-auto">
        <option>All Status</option>
        <option>Pending</option>
        <option>Confirmed</option>
        <option>Preparing</option>
      </select>
      <button className="btn-admin-primary">
        Export
      </button>
    </div>
  </div>
</div>
```

---

## STEP 6: Status Color Mapping

Create a utility function for status colors:

```typescript
// frontend/src/lib/status.ts
export function getStatusColor(status: string): {
  border: string;
  badge: string;
} {
  const statusMap: Record<string, { border: string; badge: string }> = {
    PENDING: {
      border: 'border-l-[#F59E0B]',
      badge: 'badge-warning',
    },
    CONFIRMED: {
      border: 'border-l-[#3B82F6]',
      badge: 'badge-info',
    },
    ACCEPTED: {
      border: 'border-l-[#3B82F6]',
      badge: 'badge-info',
    },
    PREPARING: {
      border: 'border-l-[#7C3AED]',
      badge: 'badge-info',
    },
    READY: {
      border: 'border-l-[#10B981]',
      badge: 'badge-success',
    },
    DISPATCHED: {
      border: 'border-l-[#10B981]',
      badge: 'badge-success',
    },
    COMPLETED: {
      border: 'border-l-[#10B981]',
      badge: 'badge-success',
    },
    CANCELLED: {
      border: 'border-l-[#6B7280]',
      badge: 'badge-neutral',
    },
    REJECTED: {
      border: 'border-l-[#EF4444]',
      badge: 'badge-error',
    },
  };

  return statusMap[status] || {
    border: 'border-l-[#6B7280]',
    badge: 'badge-neutral',
  };
}
```

---

## STEP 7: Typography Utilities

Add to `globals.css` utilities:

```css
@layer utilities {
  /* Client Typography */
  .text-display {
    font-size: var(--text-display);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .text-h1-client {
    font-size: var(--text-h1);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .text-h2-client {
    font-size: var(--text-h2);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .text-h3-client {
    font-size: var(--text-h3);
    font-weight: 600;
    line-height: 1.4;
  }

  /* Admin Typography */
  .text-h1-admin {
    font-size: var(--text-h1-admin);
    font-weight: 600;
    line-height: 1.3;
  }

  .text-h2-admin {
    font-size: var(--text-h2-admin);
    font-weight: 600;
    line-height: 1.4;
  }

  .text-body-admin {
    font-size: var(--text-body-admin);
    font-weight: 400;
    line-height: 1.5;
  }
}
```

---

## STEP 8: Quick Reference

### Client Side Color Usage
- **Primary Actions**: `bg-brand-primary` or `#D97706`
- **Text**: `text-[#0A0A0A]` (primary), `text-[#5F6368]` (secondary)
- **Backgrounds**: `bg-[#FEFBF7]` (warm off-white)
- **Borders**: `border-[#E5E7EB]` (light)

### Admin Side Color Usage
- **Primary Actions**: `bg-brand-secondary` or `#0EA5E9`
- **Text**: `text-[#0A0A0A]` (primary), `text-[#5F6368]` (secondary)
- **Backgrounds**: `bg-[#F8F9FA]` (cool gray)
- **Borders**: `border-[#E5E7EB]` (light)

### Status Colors
- **Success**: `bg-status-success-bg text-status-success-text`
- **Warning**: `bg-status-warning-bg text-status-warning-text`
- **Error**: `bg-status-error-bg text-status-error-text`
- **Info**: `bg-status-info-bg text-status-info-text`
- **Neutral**: `bg-status-neutral-bg text-status-neutral-text`

---

## Implementation Checklist

- [ ] Update CSS variables in `globals.css`
- [ ] Add component classes to `globals.css`
- [ ] Update `tailwind.config.js` with new colors
- [ ] Update client homepage hero section
- [ ] Update product cards with new styling
- [ ] Update navigation with warm accents
- [ ] Update admin order cards with status colors
- [ ] Update admin buttons with new styles
- [ ] Create status utility function
- [ ] Test accessibility (contrast ratios)
- [ ] Test responsive design
- [ ] Verify brand consistency

---

**End of Implementation Guide**
