import { ReactNode } from 'react';

interface NavbarMobileProps {
  children: ReactNode;
}

const NavbarMobile = ({ children }: NavbarMobileProps) => {
  return (
    <nav className="fixed bottom-0 flex justify-evenly w-full bg-navbar text-navbar-foreground border-b-4">
      {children}
    </nav>
  );
};

export default NavbarMobile;
