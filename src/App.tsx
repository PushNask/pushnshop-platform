import { lazy, Suspense } from 'react';
import { Toaster as NotificationToaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';
import UpdatePassword from './pages/auth/UpdatePassword';

const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const PermanentLinkDetails = lazy(() => import('./pages/PermanentLinkDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <NotificationToaster />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route 
                      path="/seller" 
                      element={
                        <ProtectedRoute allowedRoles={['seller', 'admin']}>
                          <SellerDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/details/:id" element={<ProductDetails />} />
                    <Route path="/p:linkNumber/details" element={<PermanentLinkDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
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
  );
};

export default App;
