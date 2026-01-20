export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Store Section Skeleton */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E0E0E0]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-red-200 rounded px-2 py-1 w-20 animate-pulse ml-auto"></div>
            </div>
          </div>

          {/* Product Skeleton */}
          <div className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mx-auto"></div>
              </div>
              <div className="col-span-4 md:col-span-2 flex justify-center">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mx-auto"></div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Voucher Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}