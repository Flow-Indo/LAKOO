import { LiveVideoFeed } from '@/components/live/LiveVideoFeed';

export default function LivePage() {
  return (
    <div className="h-full bg-black live-route-container">
      <LiveVideoFeed />
    </div>
  );
}

export const metadata = {
  title: 'Live Shopping | LAKU',
  description: 'Watch live shopping streams',
};