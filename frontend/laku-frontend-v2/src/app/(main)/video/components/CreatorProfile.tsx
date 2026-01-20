'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

type Props = {
  name: string;
  avatar: string;
  followers?: number;
};

export function CreatorProfile({ name, avatar }: Props) {
  const { t } = useLanguage();

  return (
    <div className="absolute left-4 bottom-24 z-50 flex items-center gap-3">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-4 border-white" />
      <div className="flex flex-col text-white text-xs drop-shadow-lg">
        <span className="font-semibold text-sm">{name}</span>
        <Button size="sm" className="mt-1 text-xs bg-red-600 text-white rounded-md">
          {t('action.follow')}
        </Button>
      </div>
    </div>
  );
}

