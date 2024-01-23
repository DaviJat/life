import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <p>Navbar</p>
    </div>
  );
};

export default Navbar;
