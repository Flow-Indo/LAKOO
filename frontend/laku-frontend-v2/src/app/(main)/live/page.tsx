import { LiveStreamPlayer } from '@/components/live-stream/LiveStreamPlayer';
import { currentLiveStream } from '@/lib/mock-live-stream-data';

export default function LivePage() {
  return <LiveStreamPlayer stream={currentLiveStream} />;
}

export const metadata = {
  title: 'Live Shopping | LAKU',
  description: 'Join live shopping streams with real-time interaction',
};