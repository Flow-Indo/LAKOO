import { Store } from '@/types/store';
import { ChevronRight } from 'lucide-react';

interface MobileStoreCategoriesProps {
  store: Store;
}

export function MobileStoreCategories({ store }: MobileStoreCategoriesProps) {
  return (
    <div className="bg-white">
      <div className="p-4">
        {store.categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3 hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.productCount} products</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}