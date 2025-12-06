import React from 'react';
import { cn } from '@utils/cn';

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
      className={cn("font-display tracking-wider w-36 rounded-full px-4 py-3 transition-opacity duration-500 cursor-pointer", className)}
    >
      {children}
    </button>
  );
};

export default Button;
