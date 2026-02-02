import React from 'react';
import { User } from 'lucide-react';

interface SigninEmailProps {
  value?: string;
  onChange?: (v: string) => void;
}

const SigninEmail: React.FC<SigninEmailProps> = ({ value = '', onChange }) => {
  return (
    <div className="w-full">
      <label className="sr-only">Email</label>
      <div className="flex items-center gap-3 border-b border-gray-200 py-3">
        <User className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Email / Phone / Username"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default SigninEmail;

