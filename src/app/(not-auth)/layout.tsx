'use client';
import { DeviceContext } from '@/components/providers/DeviceProvider'; // Ajuste o caminho conforme necessário
import Image from 'next/image';
import { FC, ReactNode, useContext } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const { isMobile } = useContext(DeviceContext);

  return (
    <div className="bg-surface min-h-screen">
      <div className={`container flex flex-col items-center pt-12 pb-4 ${isMobile ? 'w-auto' : 'w-96'}`}>
        <Image src="/images/logo-fundo-transparente.png" width={200} height={100} alt="Life" priority />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
