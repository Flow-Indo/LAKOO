import React from 'react';

interface SignUpButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const SignInButton: React.FC<SignUpButtonProps> = ({ disabled = false, onClick, children = 'Sign In', className = '' }) => {
  const baseClass = `${disabled ? 'bg-gray-200 text-gray-400' : 'bg-red-600'} mt-[20px] w-full py-3 rounded-md text-white`;
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
};

export default SignInButton;

