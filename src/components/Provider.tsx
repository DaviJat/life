'use client';

import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';

// Define as propriedades esperadas para o componente Provider.
interface ProviderProps {
  children: ReactNode;
}

// Componente Provider é uma função de componente funcional (FC) que recebe as propriedades definidas em ProviderProps.
const Provider: FC<ProviderProps> = ({ children }) => {
  // Retorna o SessionProvider do pacote next-auth/react, que envolverá os componentes filhos e fornecerá informações de sessão.
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
