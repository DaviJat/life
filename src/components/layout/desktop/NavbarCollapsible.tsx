'use client';

import { ChevronRight } from 'lucide-react';
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
        {expanded && (
          <span className={`ml-auto transition-transform duration-300 ${subMenuOpen ? 'rotate-90' : ''}`}>
            <ChevronRight />
          </span>
        )}
      </li>

      {expanded && options && (
        <ul
          className={`overflow-hidden transition-[max-height] duration-300 ${subMenuOpen ? 'max-h-80' : 'max-h-0'}
    `}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`
          relative flex items-center py-2 pl-12 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-surface-hover text-surface-foreground
        `}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavbarCollapsible;
