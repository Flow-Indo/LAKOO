import Image from 'next/image';
import { Store } from '@/types/store';

interface MobileStoreBannerProps {
  store: Store;
}

export function MobileStoreBanner({ store }: MobileStoreBannerProps) {
  if (!store.banner) return null;

  return (
    <div className="relative h-48 w-full overflow-hidden">
      <Image
        src={store.banner}
        alt={`${store.name} banner`}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      {/* Optional gradient overlay if needed for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}