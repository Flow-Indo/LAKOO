import React from 'react';
import { MapPin } from 'lucide-react';

interface LoginLocationProps {
  value?: string;
  onChange?: (v: string) => void;
}

const LoginLocation: React.FC<LoginLocationProps> = ({ value = 'Indonesia', onChange }) => {
  return (
    <div className="w-full">
      <label className="sr-only">Location</label>
      {/* location selector removed per request */}
    </div>
  );
};

export default LoginLocation;
