import Table from '@/components/tables/billToReceive/Table';
import { headers } from 'next/headers';

// Recupera função para recuperar dados da api
async function getData() {
  const response = await fetch(`${process.env.URL}/api/finance/billToReceive`, {
    method: 'GET',
    headers: headers(), // Passa os headers atuais, incluindo os cookies
    cache: 'no-store', // Mantém o cache desativado, se necessário
  });
  return await response.json();
}

// Renderiza tabela com os dados da API
async function Page() {
  const data = await getData();
  return <Table data={data}></Table>;
}

export default Page;
