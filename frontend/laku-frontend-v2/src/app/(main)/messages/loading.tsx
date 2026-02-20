export default function Loading() {
  return (
    <div className="h-screen bg-white flex">
      <div className="w-[320px] border-r border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}