import Link from 'next/link';
import { Menu } from '@/components/Menu';
import { Cart } from '@/components/Cart';
import { StickyCartButton } from '@/components/StickyCartButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation Bar - Logo Inspired */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-black z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold tracking-tight text-black uppercase" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif' }}>
                FOR YOU
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-12">
              <Link href="/" className="text-sm font-bold text-black uppercase tracking-wider hover:text-[#DC2626] transition-colors" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif', letterSpacing: '0.1em' }}>
                Menu
              </Link>
              <Link href="/orders" className="text-sm font-bold text-black uppercase tracking-wider hover:text-[#DC2626] transition-colors" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif', letterSpacing: '0.1em' }}>
                Mes commandes
              </Link>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/orders" className="text-sm font-medium text-black uppercase tracking-wide">
                Commandes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Section - Logo Inspired Bold Design */}
      <section className="relative pt-20 pb-32 lg:pb-40 overflow-hidden bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32">
          <div className="max-w-3xl">
            <h1 className="text-[4rem] lg:text-[5rem] font-bold tracking-tight text-black mb-6 leading-[1.1] uppercase" style={{ fontFamily: 'Bebas Neue, Oswald, system-ui, sans-serif' }}>
              Crafted for Taste.
              <br />
              <span className="font-bold">Delivered with Precision.</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#4B5563] font-normal mb-12 leading-relaxed">
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

      {/* Main Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-black mb-4">
                Our Menu
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Discover our carefully crafted selection
              </p>
            </div>
            <Menu />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart />
            </div>
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-gray-100 mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-black mb-4">Restaurant</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Premium dining experience delivered to your door.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-black mb-4">Contact</h3>
              <p className="text-sm text-gray-600 font-light">
                hello@foryou.com
                <br />
                +1 (555) 123-4567
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-black mb-4">Hours</h3>
              <p className="text-sm text-gray-600 font-light">
                Daily 11:00 AM - 10:00 PM
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8">
            <p className="text-xs text-gray-500 font-light text-center">
              &copy; {new Date().getFullYear()} FOR YOU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <StickyCartButton />
    </div>
  );
}
