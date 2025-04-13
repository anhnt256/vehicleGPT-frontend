import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/components/layout/Dashboard/Layout';
import { ChatAssistant } from '@/pages/Dashboard/ChatAssistant';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

function LandingPageWrapper() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/dashboard/chat" replace />;
  }

  return <LandingPage />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageWrapper />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/chat" replace />,
      },
      {
        path: 'chat',
        element: <ChatAssistant />,
      },
      {
        path: 'risk',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Risk Assessment</h1>
          </div>
        ),
      },
      {
        path: 'performance',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Performance Metrics</h1>
          </div>
        ),
      },
      {
        path: 'analytics',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Data Analytics</h1>
          </div>
        ),
      },
      {
        path: 'claims',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Claims Processing</h1>
          </div>
        ),
      },
      {
        path: 'insights',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">AI Insights</h1>
          </div>
        ),
      },
      {
        path: 'data',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Data Management</h1>
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        ),
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
