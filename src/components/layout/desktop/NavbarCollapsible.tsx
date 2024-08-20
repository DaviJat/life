import { ReactNode } from 'react';

interface NavbarCollapsibleProps {
  icon: ReactNode;
  text: string;
  options: Array<string>;
}

function NavbarCollapsible({ icon, text, options }: NavbarCollapsibleProps) {
  return (
    <div>
      <li>{options[0]}</li>
      <li>{options[1]}</li>
      <li>{options[2]}</li>
      <li>{options[3]}</li>
    </div>
  );
}

export default NavbarCollapsible;
