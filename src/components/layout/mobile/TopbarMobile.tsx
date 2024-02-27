'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function TopbarMobile() {
  const router = useRouter();

  // Função para voltar à rota anterior
  const goBack = () => {
    router.back();
  };

  return (
    <div className="w-full bg-surface flex justify-between items-center mb-4 shadow-lg">
      <Button variant="secondary" className="ml-2" onClick={goBack}>
        Voltar
      </Button>
      <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
      <div className="mr-4 w-16"></div>
    </div>
  );
}

export default TopbarMobile;
