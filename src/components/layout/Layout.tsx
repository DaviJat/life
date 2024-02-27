'use client';

import { CircleDollarSign, ClipboardList, Home } from 'lucide-react';
import { FC, ReactNode, useContext } from 'react';
import { DeviceContext } from '../providers/DeviceProvider';
import Navbar from './desktop/Navbar';
import NavbarItem from './desktop/NavbarItem';
import NavbarMobile from './mobile/NavbarMobile';
import TopbarMobile from './mobile/TopbarMobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { isMobile } = useContext(DeviceContext);

  return (
    <>
      {isMobile ? (
        <div>
          <TopbarMobile />
          <div className="h-full container mb-12">{children}</div>
          <div className="fixed bottom-0 w-full">
            <NavbarMobile />
          </div>
        </div>
      ) : (
        <div className="inline-flex w-full">
          <Navbar>
            <NavbarItem icon={<Home size={20} />} text="Home" route="/home" />
            <NavbarItem icon={<ClipboardList size={20} />} text="Tarefas" route="/task" />
            <NavbarItem icon={<CircleDollarSign size={20} />} text="Financeiro" route="/finance" />
          </Navbar>
          <div className="w-full overflow-y-auto max-h-screen">
            <div className="container pt-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
