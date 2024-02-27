'use client';

import WalletForm from '@/components/forms/WalletForm';
import { useParams } from 'next/navigation';

function Page() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="font-semibold text-2xl">Editar carteira</h1>
      <WalletForm id={params.id} />
    </div>
  );
}

export default Page;
