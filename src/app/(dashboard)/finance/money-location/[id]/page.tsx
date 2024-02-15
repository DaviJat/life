import MoneyLocationForm from '@/components/form/MoneyLocationForm';
import { useParams } from 'next/navigation';

function Page() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1>Money Location</h1>
      <MoneyLocationForm id={params.id} />
    </div>
  );
}

export default Page;
