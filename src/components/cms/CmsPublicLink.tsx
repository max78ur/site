import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function CmsPublicLink({
  href,
  children,
  className,
  onClick,
  active = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link
        to={href}
        className={className}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      target={href.startsWith('https://') ? '_blank' : undefined}
      rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

