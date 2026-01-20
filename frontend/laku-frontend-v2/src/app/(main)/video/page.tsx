import { LiveShoppingFeed } from '@/components/live/LiveShoppingFeed';
import { LiveDesktopContainer } from '@/components/live/LiveDesktopContainer';
import { mockLiveShoppingVideos } from '@/lib/mock-live-shopping-data';

export default function LivePage() {
  return (
    <LiveDesktopContainer>
      <LiveShoppingFeed initialVideos={mockLiveShoppingVideos} />
    </LiveDesktopContainer>
  );
}

export const metadata = {
  title: 'Live Shopping | LAKU',
  description: 'Discover trending products and live shopping videos',
};

 