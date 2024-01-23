import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return redirect('/home');
  }
  return redirect('/sign-in');
};

export default Home;
