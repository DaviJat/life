'use client'; // Diretiva do Next.js que indica que este arquivo deve ser executado apenas no lado do cliente.

import { SessionProvider } from 'next-auth/react'; // Importa SessionProvider de 'next-auth/react' para gerenciar a sessão do usuário.
import { FC, ReactNode } from 'react'; // Importa FC (Functional Component) e ReactNode de 'react'.

// Define uma interface para os props do componente Provider.
interface ProviderProps {
  children: ReactNode; // children é do tipo ReactNode, representando qualquer conteúdo renderizável no React.
}

// Define o componente funcional Provider.
// ({ children }) é usado para extrair a propriedade children das props recebidas pelo componente (ProviderProps).
const Provider: FC<ProviderProps> = ({ children }) => {
  // Retorna o SessionProvider do NextAuth.js, envolvendo o conteúdo passado como children.
  return <SessionProvider>{children}</SessionProvider>;
};

// Exporta o componente Provider como padrão.
export default Provider;
