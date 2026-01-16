import Link from 'next/link';
import { ProductGrid } from '@/components/product';
import { Button } from '@/components/ui';
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export default function ShopHomePage() {
  // Flash sale products (first 4 products)
  const flashSaleProducts = MOCK_PRODUCTS.slice(0, 4);

  // Featured products (all products)
  const featuredProducts = MOCK_PRODUCTS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Belanja Produk Indonesia
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Temukan produk berkualitas dari seluruh Nusantara dengan harga terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Mulai Belanja
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kategori Produk</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Jelajahi berbagai kategori produk unggulan dari penjual terpercaya di Indonesia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 hover:border-red-300"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">Jelajahi sekarang</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Flash Sale 🔥</h2>
              <p className="text-gray-600">Penawaran terbatas dengan diskon spesial</p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">23</div>
                <div className="text-xs text-gray-500">Jam</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">45</div>
                <div className="text-xs text-gray-500">Menit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-xs text-gray-500">Detik</div>
              </div>
            </div>
          </div>

          <ProductGrid products={flashSaleProducts} />

          <div className="text-center mt-8">
            <Link href="/products?sale=true">
              <Button variant="outline" size="lg">
                Lihat Semua Flash Sale
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Koleksi produk terbaik dari penjual terpercaya dengan rating tertinggi
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tetap Terhubung</h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Dapatkan informasi terbaru tentang produk baru, promo spesial, dan tips belanja
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-6">
              Berlangganan
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}