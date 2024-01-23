import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl">Home</h1>
    </div>
  );
};

export default Home;
