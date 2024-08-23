'use client';

import { SheetClose } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavbarMobileItemProps {
  icon: ReactNode;
  text: string;
  path: string;
}

function NavbarMobileItem({ icon, text, path }: NavbarMobileItemProps) {
  const pathname = usePathname();
  const isActive = pathname === path;
  return (
    <Link href={path}>
      <SheetClose asChild>
        <li
          className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-surface-hover text-surface-foreground'}
          `}
        >
          {icon}
          <span className="ml-3">{text}</span>
        </li>
      </SheetClose>
    </Link>
  );
}

export default NavbarMobileItem;
