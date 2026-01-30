export function CartHeader({ count = 0 }: { count?: number }) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-xl font-medium text-gray-900">
          Keranjang Belanja <span className="text-sm text-gray-600">({count})</span>
        </h1>
      </div>

      {/* Table Header - Desktop Only */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-600">
          <div className="col-span-1 flex items-center">
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="col-span-5">Produk</div>
          <div className="col-span-2 text-center">Harga Satuan</div>
          <div className="col-span-2 text-center">Kuantitas</div>
          <div className="col-span-1 text-center">Total Harga</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>
      </div>
    </div>
  );
}