'use client';

import { columns } from '@/components/tables/wallet/columns';
import DataTable from '@/components/tables/wallet/data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Table({ data }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Carteira</h1>
        <Link href="wallet/create">
          <Button>Criar</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}

export default Table;
