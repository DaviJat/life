'use client';

import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import { DeviceProvider } from './DeviceProvider';

// Define as propriedades esperadas para o componente Provider.
interface ProviderProps {
  children: ReactNode;
}

// Componente Provider é uma função para promover recursos englobando os componentes no layout do app
const Provider: FC<ProviderProps> = ({ children }) => {
  // Retorna o SessionProvider e o DeviceProvider, envolvendo os componentes filhos
  return (
    <SessionProvider>
      <DeviceProvider>{children}</DeviceProvider>
    </SessionProvider>
  );
};

export default Provider;
