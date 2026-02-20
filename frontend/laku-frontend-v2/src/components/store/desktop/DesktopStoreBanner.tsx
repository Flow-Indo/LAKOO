import Image from 'next/image';
import { Store } from '@/types/store';

interface DesktopStoreBannerProps {
  store: Store;
}

export function DesktopStoreBanner({ store }: DesktopStoreBannerProps) {
  if (!store.banner) return null;

  return (
    <div className="relative h-64 w-full overflow-hidden bg-gray-100">
      <Image
        src={store.banner}
        alt={`${store.name} banner`}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      {/* Optional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
    </div>
  );
}