import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CircleDollarSign, ClipboardList, Home, Menu, User } from 'lucide-react';
import NavbarMobileCollapsible from './NavbarMobileCollapsible';
import NavbarMobileItem from './NavbarMobileItem';

const NavbarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="ml-2">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="bg-surface text-surface-foreground border-none px-3"
      >
        <SheetHeader>
          <SheetTitle>
            <img src="/images/logo-fundo-transparente.png" className="w-32" alt="" />
          </SheetTitle>
        </SheetHeader>
        <NavbarMobileItem icon={<Home size={20} />} text="Home" path="/home" />
        <NavbarMobileItem icon={<ClipboardList size={20} />} text="Tarefas" path="/task" />
        <NavbarMobileCollapsible
          icon={<CircleDollarSign size={20} />}
          text="Financeiro"
          options={[
            { label: 'Entrada', path: '/finance/walletEntry' },
            { label: 'Saída', path: '/finance/walletExit' },
            { label: 'Contas a Pagar', path: '/finance/billToPay' },
            { label: 'Contas a Receber', path: '/finance/billToReceive' },
          ]}
        />
        <NavbarMobileItem icon={<User size={20} />} text="Pessoa" path="/person" />
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMobile;
