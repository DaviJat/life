'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useContext } from 'react';
import { NavbarContext } from './Navbar';

interface NavbarItemProps {
  icon: ReactNode;
  text: string;
  route: string;
}

function NavbarItem({ icon, text, route }: NavbarItemProps) {
  const { expanded } = useContext(NavbarContext);
  const pathname = usePathname();
  const isActive = pathname === route;
  return (
    <Link href={route}>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-surface-hover text-surface-foreground'}
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? 'w-28 ml-3' : 'w-0'}`}>{text}</span>

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              ${isActive ? 'bg-accent text-accent-foreground' : 'bg-surface text-surface-foreground'} text-sm
              invisible opacity-80 translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

export default NavbarItem;
