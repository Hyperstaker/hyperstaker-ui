import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ReactNode } from "react";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
}

export function NavLink({ children, href, ...props }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-text-nav-link hover:text-white transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
} 