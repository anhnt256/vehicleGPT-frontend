import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import './globals.css';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        className: 'my-toast',
        style: {
          opacity: 1,
          animationDuration: '300ms',
          transition: 'all 0.3s ease-in-out',
          transform: 'translateY(0)',
        },
      }}
    />
    <App />
  </React.StrictMode>
);
