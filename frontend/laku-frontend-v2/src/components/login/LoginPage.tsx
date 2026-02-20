 'use client';
 
 import React from 'react';
 import LoginLocation from '@/components/login/LoginLocation';
 import LoginEmail from '@/components/login/LoginEmail';
 import LoginPassword from '@/components/login/LoginPassword';
import { useState } from 'react';

interface Props {}

const LoginPage: React.FC<Props> = () => {
  const [country, setCountry] = useState('Indonesia');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-2.5">Login</h1>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-6 border-0">
          <LoginLocation value={country} onChange={setCountry} />
          <div className="mt-4" />
          <LoginEmail value={email} onChange={setEmail} />
          <LoginPassword value={password} onChange={setPassword} visible={passwordVisible} onToggleVisible={() => setPasswordVisible((s) => !s)} />

          <button
            disabled={!canSubmit}
            className={`mt-5 w-full py-3 rounded-md text-white ${canSubmit ? 'bg-red-600' : 'bg-gray-200 text-gray-400'}`}
            onClick={() => { /* noop - integrate auth as needed */ }}
          >
            Log In
          </button>

          <div className="mt-2.5 text-sm">
            <a href="/out?tab=signin" className="text-blue-600">Switch to Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
