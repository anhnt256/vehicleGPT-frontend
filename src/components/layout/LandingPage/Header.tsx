import { Logo } from '@/components/logo';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export const Header = () => {
  return (
    <div className="fixed top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="mx-auto flex items-center justify-between w-full px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};
