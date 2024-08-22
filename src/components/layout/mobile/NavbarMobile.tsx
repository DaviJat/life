import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';

import { CircleDollarSign, ClipboardList, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NavbarMobile = () => {
  const pathname = usePathname();
  const firstPartOfPathname = pathname.split('/')[1];

  return (
    <Menubar className="flex justify-evenly bg-surface text-surface-foreground rounded-none border-none p-6">
      {/* ------- Finance ------- */}
      <MenubarMenu>
        <MenubarTrigger className={`px-10 py-1.5 rounded ${firstPartOfPathname === 'finance' ? '!bg-accent' : ''}`}>
          <CircleDollarSign />
        </MenubarTrigger>
        <MenubarContent>
          <Link href={'/finance/wallet'}>
            <MenubarItem>Carteira</MenubarItem>
          </Link>
          <MenubarSeparator />
          <Link href={'/finance/walletEntry'}>
            <MenubarItem>Entrada</MenubarItem>
          </Link>
          <Link href={'/finance/walletExit'}>
            <MenubarItem>Saída</MenubarItem>
          </Link>
          <MenubarSeparator />
          <Link href={'/finance'}>
            <MenubarItem>Contas a pagar</MenubarItem>
          </Link>
          <Link href={'/finance'}>
            <MenubarItem>Contas a receber</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>

      {/* ------- Person ------- */}
      <MenubarMenu>
        <Link href={'/person'}>
          <div className={`px-10 py-1.5 rounded ${firstPartOfPathname === 'person' ? 'bg-accent' : ''}`}>
            <User />
          </div>
        </Link>
      </MenubarMenu>

      {/* ------- Task ------- */}
      <MenubarMenu>
        <Link href={'/task'}>
          <div className={`px-10 py-1.5 rounded ${firstPartOfPathname === 'task' ? 'bg-accent' : ''}`}>
            <ClipboardList />
          </div>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
};

export default NavbarMobile;
