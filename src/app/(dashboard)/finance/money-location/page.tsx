'use client';

import DataTable from '@/app/(dashboard)/finance/money-location/data-table';
import { Button } from '@/components/ui/button';
import { MoneyLocation } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { columns } from './columns';

function Page() {
  const [data, setData] = useState<MoneyLocation[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/finance/money-location', { cache: 'no-store' });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Local dinheiro</h1>
        <Link href="money-location/create">
          <Button>Criar</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}

export default Page;
