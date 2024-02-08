'use client';

import { ChevronFirst, ChevronLast, CircleUserRound, MoreVertical } from 'lucide-react';
import { ReactNode, createContext, useState } from 'react';

interface NavbarProps {
  children: ReactNode;
}

export const NavbarContext = createContext({ expanded: true });

const Navbar = ({ children }: NavbarProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full inline-flex flex-col bg-navbar shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/images/logo-fundo-transparente.png"
            className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg transition-colors text-primary-foreground hover:bg-primary-hover"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <NavbarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </NavbarContext.Provider>
        <div className="border-t flex p-3 text-navbar-foreground justify-center">
          <CircleUserRound className="h-full" size={28} />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-48 ml-3' : 'w-0'}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">John Doe</h4>
              <span className="text-xs text-white">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;
