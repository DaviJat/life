import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => (
  <div>
    <h1 className="text-4xl">Home</h1>
    <Link className={buttonVariants()} href="/admin">
      Open My Admin
    </Link>
  </div>
);

export default Home;
