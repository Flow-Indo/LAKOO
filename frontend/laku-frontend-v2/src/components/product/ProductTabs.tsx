'use client';

import { useState } from 'react';
import { FileText, Ruler, Store } from 'lucide-react';
import Image from 'next/image';
import { CollapsibleSection } from './CollapsibleSection';

interface SizeChartRow {
  size: string;
  waist: string;
  hip: string;
  length: string;
}

interface ProductTabsProps {
  product: {
    description: string;
    material: string;
    pattern: string;
    style: string;
    fit: string;
    sizeChart: SizeChartRow[];
    seller: {
      name: string;
      logo: string;
      description: string;
      productCount: number;
      followers: number;
      rating: number;
    };
  };
}

const tabs = [
  { id: 'description', label: 'Description', icon: FileText },
  { id: 'size', label: 'Size & Fit', icon: Ruler },
  { id: 'about', label: 'About Store', icon: Store },
];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-8 md:mt-12 border-t border-gray-200">
      {/* Desktop: Horizontal Tabs */}
      <div className="hidden md:flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-all relative
                ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: Tab Content */}
      <div className="hidden md:block py-6">
        {activeTab === 'description' && (
          <DescriptionContent product={product} />
        )}
        {activeTab === 'size' && <SizeFitContent product={product} />}
        {activeTab === 'about' && <AboutStoreContent product={product} />}
      </div>

      {/* Mobile: Collapsible Sections */}
      <div className="md:hidden px-4">
        <CollapsibleSection
          title="Description"
          icon={<FileText className="w-5 h-5" />}
          defaultOpen={true}
        >
          <DescriptionContent product={product} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Size & Fit"
          icon={<Ruler className="w-5 h-5" />}
        >
          <SizeFitContent product={product} />
        </CollapsibleSection>

        <CollapsibleSection
          title="About Store"
          icon={<Store className="w-5 h-5" />}
        >
          <AboutStoreContent product={product} />
        </CollapsibleSection>
      </div>
    </div>
  );
}

// Description Tab Content
function DescriptionContent({ product }: { product: ProductTabsProps['product'] }) {
  return (
    <div className="prose max-w-none">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        trends / #ChiefWEsit
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Product Details:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>
                <strong>Material:</strong> {product.material}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>
                <strong>Pattern:</strong> {product.pattern}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>
                <strong>Style:</strong> {product.style}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>
                <strong>Fit:</strong> {product.fit}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Care Instructions:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Machine wash cold</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Do not bleach</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Tumble dry low</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Do not iron</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Size & Fit Tab Content
function SizeFitContent({ product }: { product: ProductTabsProps['product'] }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Overall Fit:{' '}
          <span className="font-semibold text-gray-900">True to Size</span>
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 text-xs">Small</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: '87%' }}
            />
          </div>
          <span className="text-gray-500 text-xs">Large</span>
          <span className="font-semibold text-gray-900">87%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2 font-semibold text-gray-900">
                Size
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">
                Waist (cm)
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">
                Hip (cm)
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">
                Length (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {product.sizeChart.map((row) => (
              <tr key={row.size} className="border-b border-gray-200">
                <td className="py-3 px-2 font-medium text-gray-900">
                  {row.size}
                </td>
                <td className="text-center py-3 px-2 text-gray-600">
                  {row.waist}
                </td>
                <td className="text-center py-3 px-2 text-gray-600">
                  {row.hip}
                </td>
                <td className="text-center py-3 px-2 text-gray-600">
                  {row.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// About Store Tab Content
function AboutStoreContent({ product }: { product: ProductTabsProps['product'] }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {product.seller.logo ? (
          <Image
            src={product.seller.logo}
            alt={product.seller.name}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {product.seller.name}
        </h3>
    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
      {product.seller.description ?? 'Toko resmi'}
    </p>

    <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-600">Products:</span>
            <span className="font-semibold text-gray-900 ml-2">
          {(() => {
            const count = product.seller.productCount ?? ((product as any).storeProducts?.length ?? 0);
            return count.toLocaleString('id-ID');
          })()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Followers:</span>
            <span className="font-semibold text-gray-900 ml-2">
          {((product.seller.followers ?? 0) / 1000).toFixed(1)}k
            </span>
          </div>
          <div>
            <span className="text-gray-600">Rating:</span>
            <span className="font-semibold text-gray-900 ml-2">
          {(product.seller.rating ?? 0)}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}