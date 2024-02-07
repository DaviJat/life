'use client';

import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import { ReactNode, createContext, useState } from 'react';

interface NavbarProps {
  children: ReactNode;
}

export const NavbarContext = createContext({ expanded: true });

const Navbar = ({ children }: NavbarProps) => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  window.addEventListener('resize', () => {
    setIsMobile(window.innerWidth < 768);
  });

  return (
    <>
      {isMobile ? (
        <div className="flex justify-around bg-gray-900">{children}</div>
      ) : (
        <aside className="h-screen">
          <nav className="h-full inline-flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
              <img
                src="https://img.logoipsum.com/243.svg"
                className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
                alt=""
              />
              <button
                onClick={() => setExpanded((curr) => !curr)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                {expanded ? <ChevronFirst /> : <ChevronLast />}
              </button>
            </div>
            <NavbarContext.Provider value={{ expanded }}>
              <ul className="flex-1 px-3">{children}</ul>
            </NavbarContext.Provider>
            <div className="border-t flex p-3">
              <img
                src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div
                className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}
          `}
              >
                <div className="leading-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <span className="text-xs text-gray-600">johndoe@gmail.com</span>
                </div>
                <MoreVertical size={20} />
              </div>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Navbar;
