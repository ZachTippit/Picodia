import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@utils/cn";

interface MenuLinkProps {
  to: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

const MenuLink = ({ to, onClick, className, children }: MenuLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "w-full bg-gray-100 text-gray-800 flex flex-row items-center gap-x-4 rounded-md px-3 py-2 text-left text-sm font-medium transition hover:bg-gray-300 cursor-pointer",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default MenuLink;
