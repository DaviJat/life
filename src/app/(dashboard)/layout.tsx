import { FC, ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => (
  <div className="bg-slate-200 p-10 rounded-md">{children}</div>
);

export default DashboardLayout;
