import { Suspense } from 'react';
import OrdersHeader from './OrdersHeader';
import OrdersContent from './OrdersContent';

export default function OrdersPage() {
  return (
    <div className="pt-[10px] pb-[10px] px-0">
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <OrdersHeader />
        <OrdersContent />
      </Suspense>
    </div>
  );
}