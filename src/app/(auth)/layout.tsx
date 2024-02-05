import Image from 'next/image';
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => (
  <div className="container flex flex-col items-center bg-gray-800 px-8 pt-2 pb-4 rounded-md lg: w-80">
    <Image src="/images/logo-fundo-transparente.png" width={200} height={200} alt="Picture of the author" />
    {children}
  </div>
);

export default AuthLayout;
