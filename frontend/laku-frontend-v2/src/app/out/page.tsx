'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginPage from '@/components/login/LoginPage';
import SigninPage from '@/components/signin/SigninPage';

function AuthPageContent() {
  const params = useSearchParams();
  const tab = params?.get('tab') === 'signin' ? 'signin' : 'login';

  return <div>{tab === 'signin' ? <SigninPage /> : <LoginPage />}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
