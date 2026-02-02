'use client';

import React from 'react';
import SigninLocation from '@/components/signin/SigninLocation';
import SigninEmail from '@/components/signin/SigninEmail';
import SigninPassword from '@/components/signin/SigninPassword';
import SigninPasswordConfirm from '@/components/signin/SigninPasswordConfirm';
import SignInButton from './SignInButton';
import { useState } from 'react';

interface Props {}

const SigninPage: React.FC<Props> = () => {
  const [country, setCountry] = useState('Indonesia');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-2.5">Sign In</h1>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-6 border-0">
          <SigninLocation value={country} onChange={setCountry} />
          <div className="mt-4" />
          <SigninEmail value={email} onChange={setEmail} />
          <SigninPassword value={password} onChange={setPassword} visible={passwordVisible} onToggleVisible={() => setPasswordVisible((s) => !s)} />
          <SigninPasswordConfirm value={confirmPassword} onChange={setConfirmPassword} visible={confirmPasswordVisible} onToggleVisible={() => setConfirmPasswordVisible((s) => !s)} />

          <SignInButton disabled={!canSubmit} onClick={() => { /* noop - integrate auth as needed */ }}>
            Sign In
          </SignInButton>

          <div className="mt-[10px] text-sm">
            <a href="/out?tab=login" className="text-blue-600">Switch to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;

