'use client';

import { CircleDollarSign, ClipboardList, Home, User } from 'lucide-react';
import { FC, ReactNode, useContext } from 'react';
import { DeviceContext } from '../providers/DeviceProvider';
import Navbar from './desktop/Navbar';
import NavbarCollapsible from './desktop/NavbarCollapsible';
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
            <NavbarItem icon={<Home size={20} />} text="Home" path="/home" />
            <NavbarItem icon={<ClipboardList size={20} />} text="Tarefas" path="/task" />

            <NavbarCollapsible
              icon={<CircleDollarSign size={20} />}
              text="Financeiro"
              modulePath="/finance"
              options={[
                { label: 'Entrada', path: '/finance/walletEntry' },
                { label: 'Saída', path: '/finance/walletExit' },
                { label: 'Contas a Pagar', path: '/finance/billToPay' },
                { label: 'Contas a Receber', path: '/finance/billToReceive' },
              ]}
            />

            <NavbarItem icon={<User size={20} />} text="Pessoa" path="/person" />
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
