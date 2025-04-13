import { Shield } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b border-slate-700/50 shadow-sm bg-slate-900/80 backdrop-blur-sm flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            VehicleGPT
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};
