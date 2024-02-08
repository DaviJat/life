import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavbarMobileItemProps {
  icon: ReactNode;
  route: string;
}

function NavbarMobileItem({ icon, route }: NavbarMobileItemProps) {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <Link href={route}>
      <li
        className={`relative my-2 px-12 py-4 flex justify-center items-center rounded-md ${
          isActive ? 'bg-primary ' : ''
        }`}
      >
        {icon}
      </li>
    </Link>
  );
}

export default NavbarMobileItem;
