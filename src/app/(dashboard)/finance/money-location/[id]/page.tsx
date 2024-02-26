'use client';

import MoneyLocationForm from '@/components/forms/MoneyLocationForm';
import { useParams } from 'next/navigation';

function Page() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="font-semibold text-2xl">Editar local dinheiro</h1>
      <MoneyLocationForm id={params.id} />
    </div>
  );
}

export default Page;
