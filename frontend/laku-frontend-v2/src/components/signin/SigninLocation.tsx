import React from 'react';
import { MapPin } from 'lucide-react';

interface SigninLocationProps {
  value?: string;
  onChange?: (v: string) => void;
}

const SigninLocation: React.FC<SigninLocationProps> = ({ value = 'Indonesia', onChange }) => {
  return (
    <div className="w-full">
      <label className="sr-only">Location</label>
      <div className="flex items-center gap-3 border-b border-gray-200 py-3">
        <MapPin className="w-5 h-5 text-gray-400" />
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 appearance-none bg-transparent outline-none text-gray-700"
        >
          <option value="Indonesia">Indonesia</option>
        </select>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
};

export default SigninLocation;

