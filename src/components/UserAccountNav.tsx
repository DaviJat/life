'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

const UserAccountNav = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: false,
        }).then(() => {
          window.location.reload();
        })
      }
      variant="destructive"
    >
      Sign Out
    </Button>
  );
};

export default UserAccountNav;
