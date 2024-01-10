import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => (
  <div className="bg-slate-200 p-10 rounded-md">{children}</div>
);

export default AuthLayout;
