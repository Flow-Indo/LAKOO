'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import LoginPage from '@/components/login/LoginPage';
import SigninPage from '@/components/signin/SigninPage';

export default function Page() {
  const params = useSearchParams();
  const tab = params?.get('tab') === 'signin' ? 'signin' : 'login';

  return <div>{tab === 'signin' ? <SigninPage /> : <LoginPage />}</div>;
}

