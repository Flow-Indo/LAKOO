'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export default function ProfileSettings() {
  return (
    <div
      className="w-10 h-[27px] rounded-full flex items-center justify-center border border-white bg-transparent"
      aria-hidden="true"
    >
      <Settings className="w-4 h-4 text-white" />
    </div>
  );
}

