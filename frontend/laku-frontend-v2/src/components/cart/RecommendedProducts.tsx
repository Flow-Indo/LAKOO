import Link from 'next/link';

export function RecommendedProducts() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Mungkin Anda Juga Suka</h2>
        <Link href="/products" className="text-sm text-red-500 hover:underline">
          Lihat Semua
        </Link>
      </div>

      {/* TODO: Add product grid here */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Product cards will go here */}
        <div className="text-center text-gray-600 py-8 col-span-full">
          Rekomendasi produk akan ditampilkan di sini
        </div>
      </div>
    </div>
  );
}