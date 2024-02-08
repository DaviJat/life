'use client';

import Navbar from '@/components/layout/desktop/Navbar';
import { FC, ReactNode, useEffect, useState } from 'react';

import NavbarItem from '@/components/layout/desktop/NavbarItem';
import NavbarMobile from '@/components/layout/mobile/NavbarMobile';
import { CircleDollarSign, ClipboardList, Home } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);

  const checkWindowSize = () => {
    let windowWidth: number | undefined;
    if (typeof window !== 'undefined') {
      windowWidth = window.innerWidth;
    }
    if (windowWidth && windowWidth >= 768) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    checkWindowSize();
  }, [isMobile]);

  return (
    <>
      {isMobile ? (
        <div>
          <div className="w-full bg-navbar flex justify-center mb-4">
            <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
          </div>
          <div className="h-full container">{children}</div>
          <div className="fixed bottom-0 w-full">
            <NavbarMobile />
          </div>
        </div>
      ) : (
        <div className="inline-flex w-screen">
          <Navbar>
            <NavbarItem icon={<Home size={20} />} text="Home" route="/home" />
            <NavbarItem icon={<ClipboardList size={20} />} text="Tarefas" route="/task" />
            <NavbarItem icon={<CircleDollarSign size={20} />} text="Financeiro" route="/finance" />
          </Navbar>
          <div className="w-full">
            <div className="container">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
