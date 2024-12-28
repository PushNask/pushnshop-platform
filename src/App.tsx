import React, { lazy, Suspense, useCallback } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Toaster as NotificationToaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

import HomePage from '@/pages/HomePage';

// Lazy load other pages with chunk naming
const SellerDashboard = lazy(() => 
  import('@/pages/SellerDashboard' /* webpackChunkName: "seller-dashboard" */)
);
const AdminDashboard = lazy(() => 
  import('@/pages/AdminDashboard' /* webpackChunkName: "admin-dashboard" */)
);
const ProductDetails = lazy(() => 
  import('@/pages/ProductDetails' /* webpackChunkName: "product-details" */)
);
const PermanentLinkDetails = lazy(() => 
  import('@/pages/PermanentLinkDetails' /* webpackChunkName: "permanent-link-details" */)
);
const NotFound = lazy(() => 
  import('@/pages/NotFound' /* webpackChunkName: "not-found" */)
);

// Auth pages
const AuthPages = {
  Login: lazy(() => import('@/pages/auth/Login' /* webpackChunkName: "auth-login" */)),
  SignUp: lazy(() => import('@/pages/auth/SignUp' /* webpackChunkName: "auth-signup" */)),
  ResetPassword: lazy(() => 
    import('@/pages/auth/ResetPassword' /* webpackChunkName: "auth-reset-password" */)
  ),
  UpdatePassword: lazy(() => 
    import('@/pages/auth/UpdatePassword' /* webpackChunkName: "auth-update-password" */)
  ),
};

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      retry: 1
    }
  }
});

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Something went wrong. Please try again.',
    });
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
};

// Loading component with minimum height to prevent layout shift
const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  const handleError = useCallback((error: Error) => {
    console.error('Application error:', error);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <NotificationToaster />
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<AuthPages.Login />} />
                      <Route path="/signup" element={<AuthPages.SignUp />} />
                      <Route path="/reset-password" element={<AuthPages.ResetPassword />} />
                      <Route path="/update-password" element={<AuthPages.UpdatePassword />} />
                      
                      {/* Protected routes */}
                      <Route
                        path="/seller/*"
                        element={
                          <ProtectedRoute allowedRoles={['seller', 'admin']}>
                            <SellerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Product routes */}
                      <Route path="/details/:id" element={<ProductDetails />} />
                      <Route path="/p:linkNumber/details" element={<PermanentLinkDetails />} />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
