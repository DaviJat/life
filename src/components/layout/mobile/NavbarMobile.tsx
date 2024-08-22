import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ClipboardList, Home, Menu, User } from 'lucide-react';
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
        <NavbarMobileItem icon={<User size={20} />} text="Pessoa" path="/person" />
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMobile;
