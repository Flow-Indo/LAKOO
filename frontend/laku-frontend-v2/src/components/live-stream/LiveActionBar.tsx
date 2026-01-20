'use client';

import { ShoppingBag, MessageCircle, Flower, Gift, Share2 } from 'lucide-react';

interface Props {
  cartItemCount?: number;
  onShop?: () => void;
  onComment?: () => void;
  onRose?: () => void;
  onGift?: () => void;
  onShare?: () => void;
}

export function LiveActionBar({
  cartItemCount = 0,
  onShop,
  onComment,
  onRose,
  onGift,
  onShare
}: Props) {
  const actions = [
    {
      icon: ShoppingBag,
      label: 'Shop',
      badge: cartItemCount > 0 ? cartItemCount : undefined,
      onClick: onShop,
    },
    {
      icon: MessageCircle,
      label: 'Comment',
      onClick: onComment,
    },
    {
      icon: Flower,
      label: 'Rose',
      onClick: onRose,
    },
    {
      icon: Gift,
      label: 'Gift',
      onClick: onGift,
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: onShare,
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pb-safe-bottom">
      <div className="bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around px-4 py-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition"
            >
              <div className="relative">
                <action.icon className="w-6 h-6 text-white" />
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge > 9 ? '9+' : action.badge}
                  </div>
                )}
              </div>
              <span className="text-white text-xs font-medium">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}