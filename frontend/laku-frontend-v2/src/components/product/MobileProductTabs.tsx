'use client';

export default function MobileProductTabs() {
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between px-3 sm:px-4 overflow-x-auto no-scrollbar">
        <button className="px-1.5 sm:px-2 py-2 text-[14px] text-gray-900 border-b-2 border-red-500 font-medium whitespace-nowrap">Produk</button>
        <button className="px-1.5 sm:px-2 py-2 text-[14px] text-gray-500 whitespace-nowrap">Ulasan</button>
        <button className="px-1.5 sm:px-2 py-2 text-[14px] text-gray-500 whitespace-nowrap">Ukuran</button>
        <button className="px-1.5 sm:px-2 py-2 text-[14px] text-gray-500 whitespace-nowrap">Detail</button>
        <button className="px-1.5 sm:px-2 py-2 text-[14px] text-gray-500 whitespace-nowrap">Rekomendasi</button>
      </div>
    </div>
  );
}

