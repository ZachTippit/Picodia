import React from "react";
import { cn } from "@utils/cn";

interface MenuButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const MenuButton = ({ onClick, className, children, disabled = false }: MenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-md px-3 py-2 text-left text-sm font-medium transition bg-gray-600 hover:bg-gray-700",
        className
      )}
    >
      {children}
    </button>
  );
};

export default MenuButton;
