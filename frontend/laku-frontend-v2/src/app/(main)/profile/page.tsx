'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">{t('user.login_prompt')}</p>
          <Button onClick={() => router.push('/auth/login')}>
            {t('action.login')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('user.profile')}
        </h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          {t('action.logout')}
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {user.name}
            </h2>
            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
              {t('user.member')}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>
              {t('user.member_since')}: {new Date(user.createdAt).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-5 h-5 text-gray-400" />
            <span>ID: {user.id}</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => router.push('/orders')}>
            {t('nav.orders')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/wishlist')}>
            {t('nav.wishlist')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/notifications')}>
            {t('nav.notifications')}
          </Button>
          <Button variant="outline" onClick={() => router.push('/help')}>
            {t('nav.help')}
          </Button>
        </div>
      </Card>
    </div>
  );
}