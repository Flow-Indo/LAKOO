export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="hidden md:block border-b border-gray-200 py-3 px-4 md:px-6 lg:px-8">
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
      </div>

      {/* Back Button Skeleton - Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-200 rounded-full animate-pulse" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Image Skeleton */}
          <div className="md:col-span-7">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Info Skeleton */}
          <div className="md:col-span-5 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-12 hidden md:flex border-b border-gray-200">
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse mr-6" />
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse mr-6" />
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="mt-6 space-y-6">
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Sticky Bottom Bar Skeleton - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-200 h-16 animate-pulse safe-area-pb" />
    </div>
  );
}