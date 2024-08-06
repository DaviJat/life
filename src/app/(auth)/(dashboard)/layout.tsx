import { FC, ReactNode } from 'react';

import Layout from '@/components/layout/Layout';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default DashboardLayout;
