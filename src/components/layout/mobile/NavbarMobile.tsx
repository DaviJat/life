import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';

import { CircleDollarSign, ClipboardList, Home } from 'lucide-react';

const NavbarMobile = () => {
  return (
    <Menubar className="flex justify-evenly bg-surface text-surface-foreground rounded-none border-b-4 p-6">
      {/* ------- Finance ------- */}
      <MenubarMenu>
        <MenubarTrigger className="px-10">
          <CircleDollarSign />
        </MenubarTrigger>
        <MenubarContent>
          <Link href={'/finance/money-location'}>
            <MenubarItem>Local dinheiro</MenubarItem>
          </Link>
          <Link href={'/finance/wallet'}>
            <MenubarItem>Carteira</MenubarItem>
          </Link>
          <MenubarSeparator />
          <Link href={'/finance'}>
            <MenubarItem>Entrada</MenubarItem>
          </Link>
          <Link href={'/finance'}>
            <Link href={'/finance'}>
              <MenubarItem>Saída</MenubarItem>
            </Link>
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

      {/* ------- Home ------- */}
      <MenubarMenu>
        <Link href={'/home'}>
          <MenubarTrigger className="px-10">
            <Home />
          </MenubarTrigger>
        </Link>
      </MenubarMenu>

      {/* ------- Task ------- */}
      <MenubarMenu>
        <Link href={'/task'}>
          <MenubarTrigger className="px-10">
            <ClipboardList />
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
};

export default NavbarMobile;
