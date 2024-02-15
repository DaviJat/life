import DataTable from '@/components/table/data-table';
import { MoneyLocation } from '@prisma/client';
import { columns } from './columns';

async function getMoneyLocations(): Promise<MoneyLocation[]> {
  const response = await fetch(process.env.URL + '/api/finance/money-location');
  const data = await response.json();
  return data.moneyLocations;
}

async function page() {
  const data = await getMoneyLocations();

  return (
    <>
      <h1>Money Location</h1>
      <DataTable columns={columns} data={data} />
    </>
  );
}

export default page;
