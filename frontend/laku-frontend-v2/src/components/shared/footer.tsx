export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LAKU</span>
            </div>
            <p className="text-sm text-gray-600">
              Platform belanja online dengan fitur group buying
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produk</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/products" className="hover:text-red-600">Semua Produk</a></li>
              <li><a href="/categories" className="hover:text-red-600">Kategori</a></li>
              <li><a href="/deals" className="hover:text-red-600">Promo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/help" className="hover:text-red-600">Pusat Bantuan</a></li>
              <li><a href="/contact" className="hover:text-red-600">Kontak Kami</a></li>
              <li><a href="/faq" className="hover:text-red-600">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-red-600">Tentang Kami</a></li>
              <li><a href="/careers" className="hover:text-red-600">Karir</a></li>
              <li><a href="/press" className="hover:text-red-600">Pers</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 LAKU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}