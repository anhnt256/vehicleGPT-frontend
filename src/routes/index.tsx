import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/components/layout/Dashboard/Layout';
import { getCookie } from '@/lib/utils/cookie';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
    loader: async ({ request }) => {
      // Lấy userRole từ URL hoặc cookie
      const url = new URL(request.url);
      const userRole = url.searchParams.get('userRole') || getCookie('userRole') || 'free';
      return { userRole };
    },
  },
]);
