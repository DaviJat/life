'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useContext, useState } from 'react';
import { NavbarContext } from './Navbar';

interface NavbarCollapsibleProps {
  icon: ReactNode;
  text: string;
  options?: Array<string>;
}

function NavbarCollapsible({ icon, text, options }: NavbarCollapsibleProps) {
  const { expanded } = useContext(NavbarContext);

  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    if (expanded) {
      setSubMenuOpen(!subMenuOpen);
    }
  };

  const pathname = usePathname();
  const isActive = true;
  return (
    <div onClick={toggleSubMenu}>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-surface-hover text-surface-foreground
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? 'w-28 ml-3' : 'w-0'}`}>{text}</span>

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-surface text-surface-foreground text-sm
              invisible opacity-80 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
          >
            {text}
          </div>
        )}
      </li>
      {subMenuOpen && expanded && (
        <div
          className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-surface-hover text-surface-foreground
        `}
        >
          teste
        </div>
      )}
    </div>
  );
}

export default NavbarCollapsible;
