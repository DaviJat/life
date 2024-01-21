import Navbar from '@/components/Navbar'; // Componente
import Provider from '@/components/Provider'; // Componente
import { Toaster } from '@/components/ui/toaster'; // Componente
import '@/styles/globals.css'; // Arquivo de estilos
import type { Metadata } from 'next'; // Tipo
import { Inter } from 'next/font/google'; // Conjunto de fontes 'Inter'do Google Fonts

// Configura a fonte 'Inter' para incluir apenas o conjunto de caracteres latinos
const inter = Inter({ subsets: ['latin'] });

// Define um objeto de metadados para a página
export const metadata: Metadata = {
  title: 'Life',
  description: 'System to organize everything I need',
};

// RootLayout é um componente funcional que recebe um parâmetro 'children' do tipo 'React.ReactNode'.
// O tipo 'React.ReactNode' é um tipo genérico que pode representar qualquer coisa que pode ser renderizada
// no React, incluindo elementos JSX, strings e números.
// O destructuring é utilizado para extrair a propriedade 'children' do objeto de parâmetros passado
// para a função e atribuí-la à variável local 'children'.
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      {/* Componente Provider que envolve toda a aplicação para gerenciar o estado global */}
      <Provider>
        {/* Elemento principal da aplicação com classes de estilo */}
        <main className="h-screen flex flex-col justify-center items-center">
          {/* Componente Navbar */}
          <Navbar />
          {/* Renderiza o conteúdo da página passado como children */}
          {children}
        </main>
        {/* Componente Toaster que exibe mensagens de notificação na aplicação */}
        <Toaster />
      </Provider>
    </body>
  </html>
);

// Exporta o componente RootLayout como componente padrão
export default RootLayout;
