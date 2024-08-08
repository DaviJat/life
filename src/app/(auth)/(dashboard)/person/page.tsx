import Table from '@/components/tables/person/Table';
import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

// Recupera função para recuperar dados da api
async function getData() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const response = await fetch(process.env.URL + `/api/person/?userId=${user.id}`, { cache: 'no-store' });
  return await response.json();
}

// Renderiza tabela com os dados da API
async function Page() {
  const data = await getData();
  return <Table data={data}></Table>;
}

export default Page;
