import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold">LAKOO</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform belanja online modern dengan fitur group buying.
              Temukan produk berkualitas dari seluruh Indonesia dengan harga terbaik.
            </p>
          </div>

          {/* Customer Service Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Layanan Pelanggan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-red-400 transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-red-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-red-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-red-400 transition-colors">
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-red-400 transition-colors">
                  Kebijakan Retur
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Perusahaan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-red-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-red-400 transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-red-400 transition-colors">
                  Media
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-red-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-gray-400 hover:text-red-400 transition-colors">
                  Jadi Penjual
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ikuti Kami</h3>
            <p className="text-gray-400 text-sm">
              Tetap terhubung dengan berita dan penawaran terbaru dari LAKOO.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/lakoo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/lakoo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/lakoo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-red-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/privacy" className="hover:text-red-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/cookies" className="hover:text-red-400 transition-colors">
                Kebijakan Cookie
              </Link>
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} LAKOO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}