import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FC, ReactNode } from 'react';

import SidebarItem from '@/components/layout/SidebarItem';
import { CircleDollarSign, ClipboardList, Home } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="inline-flex w-screen">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Home" route="/home" />
        <SidebarItem icon={<ClipboardList size={20} />} text="Tarefas" route="/tarefas" />
        <SidebarItem icon={<CircleDollarSign size={20} />} text="Financeiro" route="/financeiro" />
      </Sidebar>
      <div className="w-full">
        <Navbar />
        <div className="container">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
