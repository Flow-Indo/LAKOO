import Link from 'next/link';
import { CartButton } from './CartButton';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LAKOO</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Produk
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Pesanan
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Profil
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <CartButton />

            {/* Login Link */}
            <Link
              href="/auth/login"
              className="hidden sm:block text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Masuk
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}