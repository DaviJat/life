import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        <Link href={'finance/money-location'}>Local dinheiro</Link>
        <Link href={'finance/wallet'}>Carteira</Link>
        <Link href={'finance/'}>Entrada</Link>
        <Link href={'finance/'}>Saída</Link>
        <Link href={'finance/'}>Contas a pagar</Link>
        <Link href={'finance/'}>Contas a receber</Link>
      </div>
    );
  }
  return redirect('/sign-in');
};

export default page;
