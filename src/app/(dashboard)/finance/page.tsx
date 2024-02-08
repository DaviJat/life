import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return <div>GRÁFICOS DO FINANCEIRO</div>;
  }
  return redirect('/sign-in');
};

export default page;
