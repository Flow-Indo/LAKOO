import {
  Home,
  Video,
  Bell,
  ShoppingCart,
  User,
  Heart,
  Package,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  id: string;
  labelKey: string;        // Translation key for LanguageContext
  icon: LucideIcon;
  href: string;
  badge: boolean;          // Show badge (for cart/notifications)
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    labelKey: 'nav.home',
    icon: Home,
    href: '/',
    badge: false,
  },
  {
    id: 'live',
    labelKey: 'nav.live',
    icon: Video,
    href: '/live',  // Real route now
    badge: false,
  },
  {
    id: 'notifications',
    labelKey: 'nav.notifications',
    icon: Bell,
    href: '/notifications',
    badge: true,  // Show notification count
  },
  {
    id: 'cart',
    labelKey: 'nav.cart',
    icon: ShoppingCart,
    href: '/cart',
    badge: true,  // Show cart count
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    icon: User,
    href: '/profile',
    badge: false,
  },
];

// Desktop-only additional items for LeftSidebar
export const DESKTOP_NAV_ITEMS: NavItem[] = [
  {
    id: 'wishlist',
    labelKey: 'nav.wishlist',
    icon: Heart,
    href: '/wishlist',
    badge: false,
  },
  {
    id: 'orders',
    labelKey: 'nav.orders',
    icon: Package,
    href: '/orders',
    badge: false,
  },
  {
    id: 'help',
    labelKey: 'nav.help',
    icon: HelpCircle,
    href: '/help',
    badge: false,
  },
];