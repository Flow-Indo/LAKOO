import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface SigninPasswordProps {
  value?: string;
  onChange?: (v: string) => void;
  visible?: boolean;
  onToggleVisible?: () => void;
}

const SigninPassword: React.FC<SigninPasswordProps> = ({ value = '', onChange, visible = false, onToggleVisible }) => {
  return (
    <div className="w-full">
      <label className="sr-only">Password</label>
      <div className="flex items-center gap-3 border-b border-gray-200 py-3 mb-5">
        <Lock className="w-5 h-5 text-gray-400" />
        <input
          type={visible ? 'text' : 'password'}
          placeholder="Password"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <button type="button" onClick={onToggleVisible} className="text-gray-500">
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        <a href="#" className="text-sm text-blue-600 ml-3">Forgot?</a>
      </div>
    </div>
  );
};

export default SigninPassword;

