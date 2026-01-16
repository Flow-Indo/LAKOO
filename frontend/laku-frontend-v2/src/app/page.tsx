import Link from 'next/link';
import { ProductCard } from '@/components/product';
import { Button } from '@/components/ui';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ROUTES } from '@/constants';

export default function Home() {
  // Show featured products (top 4 products)
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di LAKU
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Marketplace Indonesia dengan Fitur Group Buying
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Mulai Belanja
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan produk-produk berkualitas dari seluruh Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline" size="lg">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa LAKU?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform belanja modern dengan fitur-fitur inovatif untuk pengalaman belanja terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-600">Pengiriman ke seluruh Indonesia dengan jasa kurir terpercaya</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Produk Berkualitas</h3>
              <p className="text-gray-600">Semua produk telah diverifikasi dan berasal dari penjual terpercaya</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Buying</h3>
              <p className="text-gray-600">Dapatkan harga lebih murah dengan membeli bersama komunitas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mulai Belanja?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna LAKU dan temukan produk-produk terbaik dari seluruh Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Daftar Gratis
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
