'use client';

import React from 'react';

export default function ProfileEditButton() {
  return (
    <div
      className="px-4 h-[27px] rounded-full font-medium flex items-center justify-center border border-white bg-transparent"
      aria-hidden="true"
    >
      <span className="text-xs text-white">Edit Profile</span>
    </div>
  );
}

