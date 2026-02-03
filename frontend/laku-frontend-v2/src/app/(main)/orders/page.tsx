import OrdersHeader from './OrdersHeader';
import OrdersContent from './OrdersContent';

export default function OrdersPage() {
  return (
    <div className="pt-[10px] pb-[10px] px-0">
      <OrdersHeader />
      <OrdersContent />
    </div>
  );
}