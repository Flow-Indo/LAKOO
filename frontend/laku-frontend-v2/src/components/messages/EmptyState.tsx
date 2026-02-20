import { MessageCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Pesan Anda</h3>
        <p className="text-gray-500">Kirim pesan pribadi ke teman atau penjual</p>
      </div>
    </div>
  );
}