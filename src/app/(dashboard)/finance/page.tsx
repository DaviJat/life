import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        <Link href={'financeiro/carteira'}>Carteira</Link>
        <Link href={'financeiro/entradaCarteira'}>Entrada</Link>
        <Link href={'financeiro/saidaCarteira'}>Saída</Link>
        <Link href={'financeiro/contasAPagar'}>Contas a pagar</Link>
        <Link href={'financeiro/contasAReceber'}>Contas a receber</Link>
      </div>
    );
  }
  return redirect('/sign-in');
};

export default page;
