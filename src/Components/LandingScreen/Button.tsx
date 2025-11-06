import React from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({ onClick, children, className, disabled = false }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn("w-32 rounded-full px-4 py-2 text-white transition-opacity duration-500", className)}
    >
      {children}
    </button>
  );
};

export default Button;
