import Link from 'next/link';

const Home = () => (
  <div>
    <h1 className="text-4xl">Home</h1>
    <Link href="/admin">Open My Admin</Link>
  </div>
);

export default Home;
