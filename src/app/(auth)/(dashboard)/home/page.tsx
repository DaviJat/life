import UserAccountNav from '@/components/UserAccountNav';
import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

const page = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  return (
    <div>
      Home, olá {user.username}
      <UserAccountNav />
    </div>
  );
};

export default page;
