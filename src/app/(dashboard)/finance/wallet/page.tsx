import Table from '@/components/tables/wallet/Table';

async function getData() {
  const response = await fetch(process.env.URL + '/api/finance/wallet', { cache: 'no-store' });
  return await response.json();
}

async function Page() {
  const data = await getData();

  return <Table data={data}></Table>;
}

export default Page;
