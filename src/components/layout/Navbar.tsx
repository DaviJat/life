import { Leaf } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserAccountNav from '../UserAccountNav';

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link className="flex" href="/">
          <Leaf />
        </Link>
        {session?.user ? (
          <UserAccountNav />
        ) : (
          <Link className={buttonVariants()} href="/sign-in">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
