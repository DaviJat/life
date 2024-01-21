import User from '@/components/User'; // Componente
import { buttonVariants } from '@/components/ui/button'; // Constante
import authOptions from '@/lib/auth'; // Objeto
import { getServerSession } from 'next-auth'; // Função
import Link from 'next/link'; // Componente

const Home = async () => {
  // Obtém a sessão do servidor utilizando a função getServerSession e as opções de autenticação authOptions
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl">Home</h1>
      <Link className={buttonVariants()} href="/admin">
        Open My Admin
      </Link>
      <h2>Client Session</h2>
      {/* Renderiza o componente User, exibindo informações sobre o usuário da sessão do cliente */}
      <User />
      <h2>Server Session</h2>
      {/* Converte a sessão do servidor para uma string JSON e a exibe na página */}
      {JSON.stringify(session)}
    </div>
  );
};

export default Home;
