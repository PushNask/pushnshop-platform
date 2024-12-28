import React, { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary, withErrorBoundary } from '@/components/shared/ErrorBoundary';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { lazyWithPreload } from '@/utils/lazyWithPreload';

// Define tab configuration type
type TabConfig = {
  id: string;
  label: string;
  component: ReturnType<typeof lazyWithPreload>;
};

// Lazy-loaded admin components with preload capability
const adminTabs: TabConfig[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    component: lazyWithPreload(() => import('@/components/admin/Analytics'))
  },
  {
    id: 'users',
    label: 'Users',
    component: lazyWithPreload(() => import('@/components/admin/UserManagement'))
  },
  {
    id: 'products',
    label: 'Products',
    component: lazyWithPreload(() => import('@/components/admin/ProductManagement'))
  },
  {
    id: 'payments',
    label: 'Payments',
    component: lazyWithPreload(() => import('@/components/admin/PaymentVerification'))
  },
  {
    id: 'links',
    label: 'Links',
    component: lazyWithPreload(() => import('@/components/admin/LinksManagement'))
  },
  {
    id: 'settings',
    label: 'Settings',
    component: lazyWithPreload(() => import('@/components/admin/SystemSettings'))
  },
  {
    id: 'health',
    label: 'System Health',
    component: lazyWithPreload(() => import('@/components/admin/SystemHealthMonitor'))
  }
];

// Create wrapped components with error boundaries
const wrappedComponents = adminTabs.reduce((acc, tab) => ({
  ...acc,
  [tab.id]: withErrorBoundary(tab.component)
}), {} as Record<string, React.ComponentType>);

const AdminDashboard: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList aria-label="Admin Dashboard Tabs">
            {adminTabs.map(({ id, label, component }) => (
              <TabsTrigger
                key={id}
                value={id}
                onMouseEnter={() => component.preload()}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {adminTabs.map(({ id }) => {
            const WrappedComponent = wrappedComponents[id];
            return (
              <TabsContent key={id} value={id} className="space-y-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <WrappedComponent />
                </Suspense>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;