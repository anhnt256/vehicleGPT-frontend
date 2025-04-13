import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { AppRoutes } from '@/routes';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppRoutes />
      <Toaster />
    </ClerkProvider>
  );
}

export default App;
