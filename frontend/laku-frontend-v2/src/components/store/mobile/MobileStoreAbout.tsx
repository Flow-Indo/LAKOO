import { Store } from '@/types/store';
import { MapPin, Calendar, Award, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

interface MobileStoreAboutProps {
  store: Store;
}

export function MobileStoreAbout({ store }: MobileStoreAboutProps) {
  return (
    <div className="bg-white">
      <div className="p-4 space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">About {store.name}</h3>
          <p className="text-gray-700 leading-relaxed">{store.description}</p>
        </div>

        {/* Store Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Store Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{store.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Since {store.joinedDate.getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{store.performance.responseRate}%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{store.performance.shipOnTimeRate}%</div>
              <div className="text-sm text-gray-600">On-Time Shipping</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{store.performance.customerSatisfaction}%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{store.performance.returnRate}%</div>
              <div className="text-sm text-gray-600">Return Rate</div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Policies</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Shipping Policy</div>
                <div className="text-sm text-gray-600">Free shipping on orders over Rp 100,000</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Return Policy</div>
                <div className="text-sm text-gray-600">{store.policies.returnPeriod} days free return</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Security</div>
                <div className="text-sm text-gray-600">Secure payments and privacy protection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Contact</h3>
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <Headphones className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-medium text-gray-900">Customer Service</div>
              <div className="text-sm text-gray-600">Response within {store.stats.responseTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}