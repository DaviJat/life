import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavbarMobileCollapsibleOption {
  label: string;
  path: string;
}

interface NavbarMobileCollapsibleProps {
  icon: ReactNode;
  text: string;
  options?: Array<NavbarMobileCollapsibleOption>;
}

function NavbarMobileCollapsible({ icon, text, options }: NavbarMobileCollapsibleProps) {
  const pathname = usePathname();
  return (
    <>
      <div
        className="
    relative flex items-center py-2 px-3 my-1
    font-medium rounded-md cursor-pointer
    transition-colors group hover:bg-surface-hover text-surface-foreground"
      >
        <span>{icon}</span>
        <div className="ml-3">{text}</div>
      </div>
      <div>
        {options.map((option) => (
          <Link key={option.label} href={option.path}>
            <li
              className={`
          relative flex items-center py-2 pl-12 px-3 my-1
          ${pathname === option.path ? 'bg-accent text-accent-foreground' : 'bg-surface text-surface-foreground'}
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-surface-hover text-surface-foreground whitespace-nowrap
        `}
              key={option.label}
            >
              {option.label}
            </li>
          </Link>
        ))}
      </div>
    </>
  );
}

export default NavbarMobileCollapsible;
