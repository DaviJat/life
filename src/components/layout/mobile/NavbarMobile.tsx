import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CircleDollarSign, ClipboardList, Home, Menu, User } from 'lucide-react';
import { createContext, useState } from 'react';
import NavbarMobileCollapsible from './NavbarMobileCollapsible';
import NavbarMobileItem from './NavbarMobileItem';

interface NavbarMobileContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NavbarMobileContext = createContext<NavbarMobileContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavbarMobileContext.Provider value={{ isOpen, setIsOpen }}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              <img src="/images/logo-fundo-transparente.png" className="w-32" alt="Logo" />
            </SheetTitle>
          </SheetHeader>
          <NavbarMobileItem icon={<Home size={20} />} text="Home" path="/home" />
          <NavbarMobileItem icon={<ClipboardList size={20} />} text="Tarefas" path="/task" />
          <NavbarMobileCollapsible
            icon={<CircleDollarSign size={20} />}
            text="Financeiro"
            modulePath="/finance"
            options={[
              { label: 'Carteira', path: '/finance/wallet' },
              { label: 'Entrada', path: '/finance/walletEntry' },
              { label: 'Saída', path: '/finance/walletExit' },
              { label: 'Contas a Pagar', path: '/finance/billToPay' },
              { label: 'Contas a Receber', path: '/finance/billToReceive' },
            ]}
          />
          <NavbarMobileItem icon={<User size={20} />} text="Pessoa" path="/person" />
        </SheetContent>
      </Sheet>
    </NavbarMobileContext.Provider>
  );
};

export default NavbarMobile;
