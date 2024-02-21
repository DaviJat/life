import DataTable from '@/app/(dashboard)/finance/money-location/data-table';
import { Button } from '@/components/ui/button';
import { MoneyLocation } from '@prisma/client';
import Link from 'next/link';
import { columns } from './columns';

async function getMoneyLocations(): Promise<MoneyLocation[]> {
  const response = await fetch(process.env.URL + '/api/finance/money-location');
  const data = await response.json();
  return data;
}

async function page() {
  const data = await getMoneyLocations();

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

export default page;
