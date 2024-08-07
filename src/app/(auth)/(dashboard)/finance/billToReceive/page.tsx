import Table from '@/components/tables/billToReceive/Table';

// Recupera função para recuperar dados da api
async function getData() {
  const response = await fetch(process.env.URL + '/api/finance/billToReceive', { cache: 'no-store' });
  return await response.json();
}

// Renderiza tabela com os dados da API
async function Page() {
  const data = await getData();
  return <Table data={data}></Table>;
}

export default Page;
