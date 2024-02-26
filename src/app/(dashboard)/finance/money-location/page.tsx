import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { columns } from './columns';

async function Page() {
  const response = await fetch(process.env.URL + '/api/finance/money-location', { cache: 'no-store' });
  const data = await response.json();

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
