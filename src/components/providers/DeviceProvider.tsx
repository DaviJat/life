'use client';

import { FC, ReactNode, createContext, useEffect, useState } from 'react';

// Define o tipo para o contexto de dispositivo
interface DeviceContextType {
  isMobile: boolean;
}

// Cria o contexto de dispositivo
const DeviceContext = createContext<DeviceContextType>({ isMobile: true });

// Define as propriedades esperadas para o componente DeviceProvider.
interface DeviceProviderProps {
  children: ReactNode;
}

// Define o componente DeviceProvider
const DeviceProvider: FC<DeviceProviderProps> = ({ children }) => {
  // Estado para armazenar se o dispositivo é móvel ou não
  const [isMobile, setIsMobile] = useState(true);

  // Função para verificar a largura da janela e atualizar o estado de isMobile
  const checkWindowSize = () => {
    setIsMobile(window.innerWidth < 479);
  };

  // Verifica da largura da janela para redimensionamento ao carregar a página
  useEffect(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  // Fornece o valor de isMobile para os componentes filhos usando o contexto
  return <DeviceContext.Provider value={{ isMobile }}>{children}</DeviceContext.Provider>;
};

export { DeviceContext, DeviceProvider };
