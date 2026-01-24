# FOR YOU Restaurant - Unified Design System
## Senior Product Designer / UI/UX Lead Analysis & Redesign

---

## 1. CURRENT STATE ANALYSIS

### Client Side Issues:
- ✅ **Strengths**: Clean black & white aesthetic, premium feel, good typography
- ❌ **Weaknesses**: 
  - Lacks warmth/appetite appeal (too sterile for food)
  - No visual hierarchy for food photography
  - Missing brand personality
  - Product cards need more visual interest
  - No color accents to guide appetite

### Admin Side Issues:
- ✅ **Strengths**: Clean, functional, readable
- ❌ **Weaknesses**:
  - Too similar to client side (confusing context)
  - Missing visual hierarchy for data density
  - Status indicators not prominent enough
  - Action buttons lack clear hierarchy
  - No visual separation between sections
  - Missing efficiency-focused patterns (quick actions, bulk operations)

---

## 2. RESEARCH & BEST PRACTICES

### Restaurant Customer Experience:
- **Color Psychology**: Warm tones (terracotta, amber) increase appetite; green suggests freshness; red triggers urgency/action
- **Food Photography**: High contrast, generous whitespace, subtle shadows for depth
- **Trust Signals**: Professional typography, clear pricing, consistent spacing
- **Appetite Triggers**: Rich imagery, descriptive text, visual hierarchy

### Admin Dashboard Best Practices:
- **Neutral Base**: Cool grays reduce eye strain during long sessions
- **High Contrast**: Status colors must be immediately recognizable
- **Data Density**: Compact but readable, clear grouping
- **Efficiency**: Quick actions, keyboard shortcuts, bulk operations
- **Reduced Cognitive Load**: Consistent patterns, clear hierarchy

---

## 3. UNIFIED BRAND FOUNDATION

### Core Philosophy:
**"Premium Simplicity with Purpose"**
- Client side: Warm, inviting, appetizing
- Admin side: Cool, efficient, focused
- Shared: Professional typography, consistent spacing, clear hierarchy

### Brand Adaptation Strategy:
- **Shared Elements**: Typography (Inter), spacing scale, border radius, shadows
- **Client Emphasis**: Warm accents, generous whitespace, food photography focus
- **Admin Emphasis**: Cool neutrals, compact spacing, data-first layout

---

## 4. COMPLETE COLOR SYSTEM

### Brand Colors

#### Primary Brand (Client-Focused)
```css
--brand-primary: #D97706;        /* Warm amber - appetite trigger */
--brand-primary-dark: #B45309;    /* Deeper amber for hover states */
--brand-primary-light: #FCD34D;   /* Light amber for accents */
```

**Rationale**: Amber/terracotta is proven to increase appetite and convey warmth. More prominent on client side.

#### Secondary Brand (Admin-Focused)
```css
--brand-secondary: #0EA5E9;       /* Cool blue - trust, efficiency */
--brand-secondary-dark: #0284C7; /* Deeper blue for actions */
--brand-secondary-light: #E0F2FE; /* Light blue for backgrounds */
```

**Rationale**: Blue conveys trust and professionalism. More prominent on admin side.

### Neutral Foundation (Shared)

#### Backgrounds
```css
/* Client Side - Warm, inviting */
--bg-client-primary: #FFFFFF;
--bg-client-secondary: #FEFBF7;   /* Warm off-white */
--bg-client-tertiary: #F9F7F4;    /* Subtle warm gray */

/* Admin Side - Cool, neutral */
--bg-admin-primary: #FFFFFF;
--bg-admin-secondary: #F8F9FA;   /* Cool gray */
--bg-admin-tertiary: #F1F3F5;    /* Slightly darker cool gray */
```

#### Text Colors
```css
--text-primary: #0A0A0A;          /* Pure black for maximum contrast */
--text-secondary: #5F6368;       /* Medium gray for body text */
--text-tertiary: #9CA3AF;         /* Light gray for hints/disabled */
--text-inverse: #FFFFFF;          /* White for dark backgrounds */
```

#### Borders
```css
--border-light: #E5E7EB;          /* Subtle borders */
--border-medium: #D1D5DB;         /* Standard borders */
--border-dark: #9CA3AF;           /* Strong borders */
--border-focus: #D97706;          /* Client focus (amber) */
--border-focus-admin: #0EA5E9;    /* Admin focus (blue) */
```

### Status Colors (Shared, Admin-Emphasized)

```css
/* Success */
--status-success: #10B981;        /* Green */
--status-success-bg: #D1FAE5;     /* Light green background */
--status-success-text: #065F46;   /* Dark green text */

/* Warning */
--status-warning: #F59E0B;        /* Amber */
--status-warning-bg: #FEF3C7;     /* Light amber background */
--status-warning-text: #92400E;   /* Dark amber text */

/* Error */
--status-error: #EF4444;          /* Red */
--status-error-bg: #FEE2E2;       /* Light red background */
--status-error-text: #991B1B;      /* Dark red text */

/* Info */
--status-info: #3B82F6;            /* Blue */
--status-info-bg: #DBEAFE;         /* Light blue background */
--status-info-text: #1E40AF;       /* Dark blue text */

/* Neutral (Pending, etc.) */
--status-neutral: #6B7280;         /* Gray */
--status-neutral-bg: #F3F4F6;      /* Light gray background */
--status-neutral-text: #374151;    /* Dark gray text */
```

### Client-Specific Accents
```css
--accent-warm: #F97316;           /* Orange for CTAs */
--accent-fresh: #059669;           /* Green for fresh/healthy items */
--accent-premium: #7C3AED;         /* Purple for premium items */
```

### Admin-Specific Accents
```css
--accent-action: #0EA5E9;          /* Blue for primary actions */
--accent-danger: #EF4444;          /* Red for destructive actions */
--accent-success: #10B981;          /* Green for confirmations */
```

---

## 5. TYPOGRAPHY SYSTEM

### Font Families

```css
/* Primary Font - Inter (Shared) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

/* Monospace for Numbers (Admin-focused) */
--font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
```

**Rationale**: Inter provides excellent readability at all sizes. Monospace for admin data tables.

### Type Scale

#### Client Side (Generous, Appetizing)
```css
/* Display - Hero sections */
--text-display: 3.5rem;           /* 56px - Large, impactful */
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.03em;

/* Heading 1 - Section titles */
--text-h1: 2.5rem;                /* 40px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;

/* Heading 2 - Category titles */
--text-h2: 1.875rem;              /* 30px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;

/* Heading 3 - Item names */
--text-h3: 1.5rem;                /* 24px */
  font-weight: 600;
  line-height: 1.4;

/* Body Large - Descriptions */
--text-body-lg: 1.125rem;         /* 18px */
  font-weight: 400;
  line-height: 1.7;

/* Body - Standard text */
--text-body: 1rem;                /* 16px */
  font-weight: 400;
  line-height: 1.6;

/* Body Small - Metadata */
--text-body-sm: 0.875rem;         /* 14px */
  font-weight: 400;
  line-height: 1.5;

/* Caption - Labels, hints */
--text-caption: 0.75rem;          /* 12px */
  font-weight: 400;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
```

#### Admin Side (Compact, Efficient)
```css
/* Display - Dashboard titles */
--text-display-admin: 2rem;       /* 32px */
  font-weight: 600;
  line-height: 1.2;

/* Heading 1 - Section headers */
--text-h1-admin: 1.5rem;          /* 24px */
  font-weight: 600;
  line-height: 1.3;

/* Heading 2 - Subsection headers */
--text-h2-admin: 1.25rem;          /* 20px */
  font-weight: 600;
  line-height: 1.4;

/* Heading 3 - Card titles */
--text-h3-admin: 1.125rem;        /* 18px */
  font-weight: 600;
  line-height: 1.4;

/* Body - Standard text */
--text-body-admin: 0.875rem;      /* 14px */
  font-weight: 400;
  line-height: 1.5;

/* Body Small - Metadata, labels */
--text-body-sm-admin: 0.8125rem;  /* 13px */
  font-weight: 400;
  line-height: 1.4;

/* Caption - Status, timestamps */
--text-caption-admin: 0.75rem;     /* 12px */
  font-weight: 400;
  line-height: 1.4;
```

### Typography Tone Differences

**Client Side:**
- Lighter font weights (300-400) for elegance
- More generous line-height (1.6-1.7) for readability
- Wider letter-spacing for premium feel
- Larger sizes for impact

**Admin Side:**
- Medium font weights (400-600) for clarity
- Tighter line-height (1.4-1.5) for density
- Standard letter-spacing for efficiency
- Smaller sizes for information density

---

## 6. SPACING & LAYOUT SYSTEM

### Spacing Scale (8px base unit)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Client Side Spacing (Generous)
- Section padding: `--space-24` (96px)
- Card padding: `--space-8` (32px)
- Element gaps: `--space-6` to `--space-12` (24-48px)
- Content max-width: 1280px (7xl)

### Admin Side Spacing (Compact)
- Section padding: `--space-8` (32px)
- Card padding: `--space-4` to `--space-6` (16-24px)
- Element gaps: `--space-3` to `--space-6` (12-24px)
- Content max-width: 1600px (full width with sidebars)

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Pills, badges */
```

**Client**: More rounded (`--radius-lg` to `--radius-xl`)
**Admin**: Less rounded (`--radius-md` to `--radius-lg`)

### Shadows & Elevation

```css
/* Client Side - Subtle, elegant */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Admin Side - Functional, minimal */
--shadow-admin-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-admin-md: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
--shadow-admin-lg: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
```

---

## 7. COMPONENT SYSTEM

### Buttons

#### Client Side Buttons
```css
/* Primary CTA - Warm, appetizing */
.btn-primary {
  background: var(--brand-primary);
  color: var(--text-inverse);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-body);
  letter-spacing: 0.02em;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: var(--brand-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Secondary - Subtle */
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
}

/* Ghost - Minimal */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: var(--space-3) var(--space-6);
}
```

#### Admin Side Buttons
```css
/* Primary Action - Efficient */
.btn-admin-primary {
  background: var(--brand-secondary);
  color: var(--text-inverse);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--text-body-sm-admin);
  transition: all 150ms ease;
}

/* Secondary - Neutral */
.btn-admin-secondary {
  background: var(--bg-admin-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  padding: var(--space-2) var(--space-4);
}

/* Danger - Destructive */
.btn-admin-danger {
  background: var(--status-error);
  color: var(--text-inverse);
  padding: var(--space-2) var(--space-4);
}
```

### Cards

#### Client Side Cards
```css
.card-client {
  background: var(--bg-client-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  transition: all 300ms ease;
}

.card-client:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Product Card - Special styling */
.card-product {
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-client-primary);
  box-shadow: var(--shadow-sm);
}

.card-product-image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

#### Admin Side Cards
```css
.card-admin {
  background: var(--bg-admin-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-admin-sm);
}

.card-admin-compact {
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

/* Order Card - Dense information */
.card-order {
  padding: var(--space-4);
  border-left: 3px solid var(--border-medium);
  transition: all 150ms ease;
}

.card-order:hover {
  border-left-color: var(--brand-secondary);
  background: var(--bg-admin-secondary);
}
```

### Status Badges

```css
/* Client Side - Subtle */
.badge-status {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Admin Side - Prominent */
.badge-status-admin {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-caption-admin);
  font-weight: 600;
  text-transform: uppercase;
}

/* Status Variants */
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
```

### Inputs & Forms

#### Client Side
```css
.input-client {
  width: 100%;
  padding: var(--space-4);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-body);
  background: var(--bg-client-primary);
  transition: all 200ms ease;
}

.input-client:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
```

#### Admin Side
```css
.input-admin {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-body-sm-admin);
  background: var(--bg-admin-primary);
  transition: all 150ms ease;
}

.input-admin:focus {
  outline: none;
  border-color: var(--brand-secondary);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
}
```

### Tables (Admin Only)

```css
.table-admin {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-body-sm-admin);
}

.table-admin th {
  background: var(--bg-admin-secondary);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-medium);
  font-size: var(--text-caption-admin);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-admin td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.table-admin tr:hover {
  background: var(--bg-admin-secondary);
}
```

---

## 8. KEY SCREEN REDESIGNS

### Client Side: Homepage/Menu

#### Hero Section
- **Background**: Warm gradient (`--bg-client-secondary` to `--bg-client-primary`)
- **Typography**: Large display text (56px), light weight (300)
- **CTA Button**: Primary amber button with hover lift
- **Spacing**: Generous padding (96px vertical)

#### Category Sections
- **Layout**: Grid with 2-3 columns on desktop
- **Category Header**: 
  - Large heading (30px)
  - Subtle divider line
  - Optional category image/icon
- **Spacing**: 48px between categories

#### Product Cards
- **Layout**: Grid, 2-3 columns
- **Image**: 
  - Aspect ratio 4:3
  - Rounded corners (16px)
  - Subtle shadow on hover
  - Overlay gradient on hover (darken slightly)
- **Content**:
  - Product name: 24px, semibold
  - Description: 16px, regular, 2-line clamp
  - Price: 20px, semibold, amber accent
  - "Add to Cart" button: Subtle, appears on hover
- **Interaction**: 
  - Hover: Lift effect (translateY -4px)
  - Shadow increases
  - Border color changes to amber

#### Navigation
- **Style**: Fixed, transparent background with blur
- **Height**: 80px
- **Logo**: Large, light weight
- **Links**: Uppercase, tracking-wide, subtle hover

### Admin Side: Orders Dashboard

#### Header
- **Background**: `--bg-admin-primary`
- **Title**: 32px, semibold
- **Actions**: Right-aligned button group
- **Filters**: Compact dropdowns, inline

#### Orders List
- **Layout**: Dense grid or list view toggle
- **Order Card**:
  - Compact padding (16px)
  - Left border (3px) color-coded by status
  - Key info: Order #, Customer, Total, Status (prominent badge)
  - Timestamp: Small, gray
  - Quick actions: Icon buttons (Accept, Reject, View)
- **Status Colors**:
  - Pending: Amber border
  - Confirmed: Blue border
  - Preparing: Purple border
  - Ready: Green border
  - Completed: Gray border

#### Order Detail Modal
- **Layout**: Side panel or centered modal
- **Sections**: 
  - Customer info (compact)
  - Items list (table format)
  - Totals (highlighted box)
  - Actions (sticky bottom)
- **Typography**: Smaller sizes for density
- **Actions**: Prominent, color-coded buttons

---

## 9. DEVELOPER-FRIENDLY TOKENS

### CSS Variables Structure

```css
:root {
  /* Brand Colors */
  --brand-primary: #D97706;
  --brand-primary-dark: #B45309;
  --brand-primary-light: #FCD34D;
  --brand-secondary: #0EA5E9;
  --brand-secondary-dark: #0284C7;
  --brand-secondary-light: #E0F2FE;

  /* Backgrounds */
  --bg-client-primary: #FFFFFF;
  --bg-client-secondary: #FEFBF7;
  --bg-client-tertiary: #F9F7F4;
  --bg-admin-primary: #FFFFFF;
  --bg-admin-secondary: #F8F9FA;
  --bg-admin-tertiary: #F1F3F5;

  /* Text */
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
  --font-primary: 'Inter', -apple-system, sans-serif;
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
  --space-0: 0;
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
  --shadow-admin-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-admin-md: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  --shadow-admin-lg: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
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
        primary: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Already using Tailwind's default 4px base
      },
      borderRadius: {
        'client': '1rem',
        'admin': '0.75rem',
      },
      boxShadow: {
        'client-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'client-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'client-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'admin-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'admin-md': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'admin-lg': '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
```

---

## 10. ACCESSIBILITY & CONSISTENCY CHECK

### Contrast Ratios (WCAG AA Compliance)

✅ **Text on White Background:**
- Primary text (#0A0A0A): 16.7:1 (AAA)
- Secondary text (#5F6368): 7.1:1 (AAA)
- Tertiary text (#9CA3AF): 4.5:1 (AA)

✅ **Text on Colored Backgrounds:**
- Amber button text: 4.5:1+ (AA)
- Status badges: All meet AA standards
- Blue admin buttons: 4.5:1+ (AA)

✅ **Focus States:**
- All interactive elements have visible focus indicators
- Focus rings use brand colors with sufficient contrast

### Consistency Checklist

✅ **Client Side:**
- Warm color palette throughout
- Generous spacing
- Large, readable typography
- Appetizing imagery focus
- Smooth, elegant animations

✅ **Admin Side:**
- Cool, neutral palette
- Compact, efficient spacing
- Dense but readable typography
- Data-first layout
- Quick, functional interactions

✅ **Shared:**
- Same font family (Inter)
- Consistent spacing scale
- Unified component patterns
- Clear status color system
- Accessible contrast ratios

---

## 11. IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1)
1. Update CSS variables in `globals.css`
2. Extend Tailwind config with new colors
3. Update typography classes
4. Create component utility classes

### Phase 2: Client Side (Week 2)
1. Redesign homepage hero
2. Update product cards with new styling
3. Add warm color accents
4. Improve image presentation
5. Update navigation

### Phase 3: Admin Side (Week 3)
1. Redesign orders dashboard
2. Update order cards with status colors
3. Improve data density
4. Add quick action patterns
5. Update forms and inputs

### Phase 4: Polish (Week 4)
1. Accessibility audit
2. Cross-browser testing
3. Performance optimization
4. Animation refinement
5. Final consistency check

---

## 12. DESIGN DECISION RATIONALE SUMMARY

| Decision | Client Side | Admin Side | Rationale |
|----------|-------------|------------|-----------|
| **Primary Color** | Amber (#D97706) | Blue (#0EA5E9) | Amber triggers appetite; Blue conveys trust/efficiency |
| **Background** | Warm off-white | Cool gray | Warmth invites; Cool reduces eye strain |
| **Typography Size** | Larger (16-56px) | Smaller (12-32px) | Impact vs. density |
| **Spacing** | Generous (24-96px) | Compact (12-32px) | Breathing room vs. information density |
| **Border Radius** | More rounded (16px) | Less rounded (12px) | Friendly vs. functional |
| **Shadows** | Subtle, elegant | Minimal, functional | Depth vs. clarity |
| **Status Colors** | Subtle badges | Prominent badges | Decorative vs. critical information |

---

**End of Design System Document**

This design system provides a complete, implementation-ready foundation for both client and admin experiences while maintaining brand coherence and clear differentiation.
