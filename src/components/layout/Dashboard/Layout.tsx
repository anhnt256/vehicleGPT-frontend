import { Navbar } from './NavBar';
import { Sidebar } from './SideBar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar - always visible */}
      <Navbar />

      <div className="flex pt-16">
        {' '}
        {/* Add padding-top to account for fixed navbar */}
        {/* Sidebar - hidden on mobile */}
        <div className="w-64 shrink-0 hidden lg:block">
          <Sidebar />
        </div>
        {/* Main content - full width on mobile */}
        <div className="flex-1 w-full min-w-0">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
