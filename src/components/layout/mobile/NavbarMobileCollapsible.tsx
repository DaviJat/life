import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useContext, useState } from 'react';
import { NavbarMobileContext } from './NavbarMobile';

interface NavbarMobileCollapsibleOption {
  label: string;
  path: string;
}

interface NavbarMobileCollapsibleProps {
  icon: ReactNode;
  text: string;
  modulePath: string;
  options?: Array<NavbarMobileCollapsibleOption>;
}

function NavbarMobileCollapsible({ icon, text, modulePath, options = [] }: NavbarMobileCollapsibleProps) {
  const { isOpen, setIsOpen } = useContext(NavbarMobileContext);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);
  const pathname = usePathname();

  return (
    <>
      <li
        onClick={toggleSubMenu}
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group hover:bg-surface-hover text-surface-foreground
          ${
            !subMenuOpen && pathname.startsWith(modulePath)
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-surface-hover text-surface-foreground'
          }
          `}
      >
        {icon}
        <span className="ml-3">{text}</span>
        <span className={`ml-auto transition-transform duration-500 ease-in-out ${subMenuOpen ? 'rotate-90' : ''}`}>
          <ChevronRight />
        </span>
      </li>
      <ul
        className={`overflow-hidden transition-[max-height] 
        duration-500 ease-in-out ${subMenuOpen ? 'max-h-80' : 'max-h-0'}`}
      >
        {options.map((option) => (
          <Link key={option.path} href={option.path} as={option.path}>
            <li
              onClick={() => setIsOpen(false)}
              className={`
                relative flex items-center py-2 pl-12 px-3 my-1
                ${pathname === option.path ? 'bg-accent text-accent-foreground' : 'bg-surface text-surface-foreground'}
                font-medium rounded-md cursor-pointer
                transition-colors group
                hover:bg-surface-hover whitespace-nowrap
              `}
            >
              {option.label}
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
}

export default NavbarMobileCollapsible;
