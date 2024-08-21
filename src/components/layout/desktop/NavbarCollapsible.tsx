'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useContext, useState } from 'react';
import { NavbarContext } from './Navbar';

interface NavbarCollapsibleOption {
  label: string;
  path: string;
}
interface NavbarCollapsibleProps {
  icon: ReactNode;
  text: string;
  modulePath: string;
  options?: Array<NavbarCollapsibleOption>;
}

function NavbarCollapsible({ icon, text, modulePath, options }: NavbarCollapsibleProps) {
  const { expanded, setExpanded } = useContext(NavbarContext);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    if (expanded) {
      setSubMenuOpen(!subMenuOpen);
    } else {
      setExpanded(true);
      setSubMenuOpen(true);
    }
  };

  const pathname = usePathname();

  return (
    <div>
      <li
        onClick={toggleSubMenu}
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            pathname.startsWith(modulePath) && subMenuOpen == false
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-surface-hover text-surface-foreground'
          }
          ${
            pathname.startsWith(modulePath) && subMenuOpen == true && !expanded
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-surface-hover text-surface-foreground'
          }
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? 'w-28 ml-3' : 'w-0'}`}>{text}</span>

        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            ${pathname.startsWith(modulePath) ? 'bg-accent text-accent-foreground' : 'bg-surface text-surface-foreground'} text-sm
            invisible opacity-80 translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {text}
          </div>
        )}
        {expanded && (
          <span className={`ml-auto transition-transform duration-500 ease-in-out ${subMenuOpen ? 'rotate-90' : ''}`}>
            <ChevronRight />
          </span>
        )}
      </li>

      {expanded && options && (
        <ul
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${subMenuOpen ? 'max-h-80' : 'max-h-0'}
    `}
        >
          {options.map((option, index) => (
            <Link href={option.path}>
              <li
                key={index}
                className={`
          relative flex items-center py-2 pl-12 px-3 my-1
          ${pathname === option.path && subMenuOpen == true ? 'bg-accent text-accent-foreground' : 'bg-surface text-surface-foreground'}
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-surface-hover text-surface-foreground whitespace-nowrap
        `}
              >
                {option.label}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavbarCollapsible;
