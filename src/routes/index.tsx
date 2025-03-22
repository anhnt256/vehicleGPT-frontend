import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import LandingPage from '@/pages/LandingPage';
import LandingPageLayout from '@/components/layout/LandingPage/Layout';
import DashboardLayout from '@/components/layout/Dashboard/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LandingPageLayout>
        <LandingPage />
      </LandingPageLayout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </PrivateRoute>
    ),
    loader: ({ request }) => {
      const url = new URL(request.url);
      let userRole = url.searchParams.get('userRole');
      if (!userRole) {
        userRole = 'free'; // Set default userRole
      }
      return { userRole };
    },
  },
]);
