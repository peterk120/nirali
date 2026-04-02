'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import QuickViewModal from './QuickViewModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              fontSize: '0.875rem',
            },
            success: {
              style: {
                background: 'rgb(245, 245, 245)', // Light background
                border: '1px solid rgb(220, 220, 220)',
                color: '#C9922A', // brand-gold
              },
              iconTheme: {
                primary: '#C9922A', // brand-gold
                secondary: 'white',
              },
            },
            error: {
              style: {
                background: 'rgb(245, 245, 245)', // Light background
                border: '1px solid rgb(220, 220, 220)',
                color: '#C0436A', // brand-rose
              },
              iconTheme: {
                primary: '#C0436A', // brand-rose
                secondary: 'white',
              },
            },
          }}
        />
      </ThemeProvider>
      <QuickViewModal />
    </QueryClientProvider>
  );
}