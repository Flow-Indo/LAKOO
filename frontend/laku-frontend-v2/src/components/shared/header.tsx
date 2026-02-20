export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LAKU</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-red-600 font-medium">Home</a>
            <a href="/products" className="text-gray-700 hover:text-red-600 font-medium">Products</a>
            <a href="/categories" className="text-gray-700 hover:text-red-600 font-medium">Categories</a>
            <a href="/deals" className="text-gray-700 hover:text-red-600 font-medium">Deals</a>
          </nav>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            <a href="/auth/login" className="text-gray-700 hover:text-red-600 font-medium">
              Login
            </a>
            <a href="/auth/register" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
              Register
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}