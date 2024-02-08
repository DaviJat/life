'use client';

import { usePathname, useRouter } from 'next/navigation';

function TopbarMobile() {
  const router = useRouter();
  const currentPath = usePathname();

  // Função para voltar à rota anterior
  const goBack = () => {
    router.back();
  };

  // Função para navegar para a rota de cadastro com base na rota atual
  const goToCreate = () => {
    const segments = currentPath.split('/'); // Dividindo a URL em segmentos
    const basePath = segments.slice(0, 3).join('/'); // Pegando os três primeiros segmentos (incluindo a segunda barra)
    router.push(`${basePath}/create`); // Navegando para /algumacoisa/create
  };

  return (
    <div className="w-full bg-navbar flex justify-between items-center mb-4">
      <button className="ml-2 text-navbar-foreground" onClick={goBack}>
        Voltar
      </button>
      <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
      <button className="mr-2 text-navbar-foreground" onClick={goToCreate}>
        Criar
      </button>
    </div>
  );
}

export default TopbarMobile;
