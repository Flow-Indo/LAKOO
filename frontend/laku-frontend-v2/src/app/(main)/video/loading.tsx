export default function Loading() {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
        <p className="text-white text-lg">Loading videos...</p>
      </div>
    </div>
  );
}