import { ClerkProvider } from '@clerk/clerk-react';
import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AuthWrapper } from '@/components/AuthWrapper';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppContent() {
  return (
    <AuthWrapper>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthWrapper>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;
