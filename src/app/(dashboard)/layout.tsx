'use client';

import Navbar from '@/components/layout/Navbar';
import { FC, ReactNode } from 'react';

import NavbarItem from '@/components/layout/NavbarItem';
import { CircleDollarSign, ClipboardList, Home } from 'lucide-react';
import { BrowserView, MobileView } from 'react-device-detect';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <MobileView>
        <div>
          <div>conteudo</div>
          <div className="fixed bottom-0 w-full">
            <Navbar>
              <NavbarItem icon={<CircleDollarSign size={20} />} text="Financeiro" route="/finance" />
              <NavbarItem icon={<Home size={20} />} text="Home" route="/home" />
              <NavbarItem icon={<ClipboardList size={20} />} text="Tarefas" route="/task" />
            </Navbar>
          </div>
        </div>
      </MobileView>
      <BrowserView>
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
      </BrowserView>
    </>
  );
};

export default DashboardLayout;
