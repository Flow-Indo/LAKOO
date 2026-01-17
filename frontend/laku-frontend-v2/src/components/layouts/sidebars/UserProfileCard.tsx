'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';

export function UserProfileCard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t } = useLanguage();

  // GUEST STATE
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>

          {/* Guest message */}
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {t('user.login_prompt')}
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/login">{t('user.login')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">{t('user.register')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MEMBER STATE
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
            <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200">
              {t('user.member')}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 truncate mb-3">
            {user.email}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href="/profile">{t('user.profile')}</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}