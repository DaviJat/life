'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
      <Link href={'/home'}>
        <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
      </Link>
      <div className="mr-4 w-16"></div>
    </div>
  );
}

export default TopbarMobile;
