'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Mail, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrderStatusCard from '@/app/(main)/profile/components/OrderStatusCard';
import ToolsGrid from '@/app/(main)/profile/components/ToolsGrid';
import StatsRow from '@/app/(main)/profile/components/StatsRow';

export default function ProfilePageContent() {
  const { user, logout } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
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
    <div className="h-full bg-[#F9FAFB] overflow-y-auto pb-24">
      <div className="container max-w-2xl mx-auto p-6 flex flex-col gap-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('user.profile')}</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            )}

            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">{t('user.member')}</span>
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

        {/* Stats / Orders / Tools */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
            <StatsRow />
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
            <OrderStatusCard />
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-xl mx-4 my-3 p-4">
            <ToolsGrid />
          </div>
        </div>

        {/* Logout at bottom */}
        <div className="px-4 mt-6 mb-24">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-600 hover:text-red-600 transition"
          >
            {t('action.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}