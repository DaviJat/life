'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useContext, useState } from 'react';
import { NavbarContext } from './Navbar';

interface NavbarItemProps {
  icon: ReactNode;
  text: string;
  route: string;
  alert?: boolean;
}

function NavbarItem({ icon, text, route, alert }: NavbarItemProps) {
  const { expanded } = useContext(NavbarContext);
  const pathname = usePathname();
  const isActive = pathname === route;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  window.addEventListener('resize', () => {
    setIsMobile(window.innerWidth < 768);
  });

  return (
    <>
      {isMobile ? (
        <div className="text-white p-5">{icon}</div>
      ) : (
        <Link href={route}>
          <li
            className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${isActive ? 'bg-primary text-white' : 'hover:bg-primary text-white'}
        `}
          >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? 'w-32 ml-3' : 'w-0'}`}>{text}</span>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-primary ${expanded ? '' : 'top-2'}`} />}

            {!expanded && isActive && (
              <div
                className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-primary text-white text-sm
              invisible opacity-80 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
              >
                {text}
              </div>
            )}
          </li>
        </Link>
      )}
    </>
  );
}

export default NavbarItem;
