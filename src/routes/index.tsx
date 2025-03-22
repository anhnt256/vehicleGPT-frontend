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
  },
]);
