import { ReactNode } from 'react';

interface NavbarMobileCollapsibleOption {
  label: string;
  path: string;
}

interface NavbarMobileCollapsibleProps {
  icon: ReactNode;
  text: string;
  options?: Array<NavbarMobileCollapsibleOption>;
}

function NavbarMobileCollapsible({ icon, text, options }: NavbarMobileCollapsibleProps) {
  return (
    <>
      <div
        className="
    relative flex items-center py-2 px-3 my-1
    font-medium rounded-md cursor-pointer
    transition-colors group hover:bg-surface-hover text-surface-foreground"
      >
        <span>{icon}</span>
        <div className="ml-3">{text}</div>
      </div>
      <div>
        {options.map((option) => (
          <div key={option.label}>{option.label}</div>
        ))}
      </div>
    </>
  );
}

export default NavbarMobileCollapsible;
