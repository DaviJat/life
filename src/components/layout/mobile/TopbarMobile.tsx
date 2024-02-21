'use client';

import { useRouter } from 'next/navigation';

function TopbarMobile() {
  const router = useRouter();

  // Função para voltar à rota anterior
  const goBack = () => {
    router.back();
  };

  return (
    <div className="w-full bg-surface flex justify-between items-center mb-4 shadow-lg">
      <button className="ml-2 text-surface-foreground" onClick={goBack}>
        Voltar
      </button>
      <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
      <div className="w-11 mr-2"></div>
    </div>
  );
}

export default TopbarMobile;
