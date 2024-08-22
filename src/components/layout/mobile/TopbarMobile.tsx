'use client';

import Link from 'next/link';
import NavbarMobile from './NavbarMobile';

function TopbarMobile() {
  return (
    <div className="w-full bg-surface flex justify-between items-center mb-4 shadow-lg">
      <NavbarMobile></NavbarMobile>
      <Link href={'/home'}>
        <img className="w-28" src="/images/logo-fundo-transparente.png" alt="" />
      </Link>
      <div className="mr-4 w-16"></div>
    </div>
  );
}

export default TopbarMobile;
