import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FC, ReactNode } from 'react';

import SidebarItem from '@/components/layout/SidebarItem';
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Receipt,
  Settings,
  UserCircle,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => (
  <div className="inline-flex">
    <Sidebar>
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        alert
      />
      <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" active />
      <SidebarItem icon={<UserCircle size={20} />} text="Users" />
      <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
      <SidebarItem icon={<Package size={20} />} text="Orders" alert />
      <SidebarItem icon={<Receipt size={20} />} text="Billings" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings size={20} />} text="Settings" />
      <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
    </Sidebar>
    <div>
      <Navbar></Navbar>
      {children}
    </div>
  </div>
);

export default DashboardLayout;
