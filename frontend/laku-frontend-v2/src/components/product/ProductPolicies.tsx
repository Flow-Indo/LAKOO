'use client';

import { Shield, RefreshCw, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProductPolicies {
  cod: boolean;
  return: boolean;
  returnPeriod: number;
  warranty: boolean;
}

interface Props {
  policies: ProductPolicies;
}

interface PolicyCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  content?: React.ReactNode;
}

function PolicyCard({ icon: Icon, title, subtitle, bgColor, iconBgColor, iconColor, content }: PolicyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`mx-4 mb-3 rounded-lg shadow-sm border border-gray-200 ${bgColor}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-black hover:bg-opacity-5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900 text-sm">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {isExpanded && content && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {content}
        </div>
      )}
    </div>
  );
}

export function ProductPolicies({ policies }: Props) {
  return (
    <div className="space-y-0">
      {/* COD Policy Card */}
      <PolicyCard
        icon={CreditCard}
        title="COD Policy"
        subtitle="Cash on Delivery Available"
        bgColor="bg-green-50"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        content={
          <div className="pt-3 space-y-2">
            <p className="text-sm text-gray-700">
              Pay cash when you receive your order at your doorstep. No advance payment required.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Available in all major cities</li>
              <li>• Maximum order value: Rp 10,000,000</li>
              <li>• Additional COD fee may apply</li>
            </ul>
          </div>
        }
      />

      {/* Return Policy Card */}
      <PolicyCard
        icon={RefreshCw}
        title="Return Policy"
        subtitle={`Free Return within ${policies.returnPeriod} days`}
        bgColor="bg-blue-50"
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        content={
          <div className="pt-3 space-y-2">
            <p className="text-sm text-gray-700">
              Easy returns and exchanges within {policies.returnPeriod} days of delivery.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Items must be unused and in original packaging</li>
              <li>• Free return shipping for defective items</li>
              <li>• Refund processed within 3-5 business days</li>
            </ul>
          </div>
        }
      />

      {/* Shopping Security Card */}
      <PolicyCard
        icon={Shield}
        title="Shopping Security"
        subtitle="Safe & Secure Shopping"
        bgColor="bg-purple-50"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        content={
          <div className="pt-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Safe Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Privacy Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">SSL Encrypted Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Buyer Protection Program</span>
            </div>
          </div>
        }
      />
    </div>
  );
}