import Image from 'next/image';
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => (
  <div className="bg-gray-800 h-screen">
    <div className="container flex flex-col items-center justify-center h-screen w-80">
      <Image src="/images/logo-fundo-transparente.png" width={200} height={200} alt="Picture of the author" />
      {children}
    </div>
  </div>
);

export default AuthLayout;
