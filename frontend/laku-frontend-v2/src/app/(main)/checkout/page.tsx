import { AppLayout } from '@/components/layouts';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';

// Make page server-side to prepare any server data before hydrating client checkout UI
export default async function Checkout() {
  // TODO: fetch server-side data (shipping options, user addresses) when API available
  // For now return same UI — CheckoutPage is a client component that will fetch cart from client store
  return (
    <AppLayout>
      <CheckoutPage />
    </AppLayout>
  );
}