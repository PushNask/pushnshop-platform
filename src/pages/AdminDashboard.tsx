// pages/AdminDashboard.tsx

import React, { Suspense } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ErrorBoundary, { withErrorBoundary } from '@/components/shared/ErrorBoundary'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { lazyWithPreload } from '@/utils/lazyWithPreload'

// Lazy-loaded admin components with preload capability
const Analytics = lazyWithPreload(() => import('@/components/admin/Analytics'))
const UserManagement = lazyWithPreload(() => import('@/components/admin/UserManagement'))
const PaymentVerification = lazyWithPreload(() => import('@/components/admin/PaymentVerification'))
const ProductManagement = lazyWithPreload(() => import('@/components/admin/ProductManagement'))
const LinksManagement = lazyWithPreload(() => import('@/components/admin/LinksManagement'))
const SystemSettings = lazyWithPreload(() => import('@/components/admin/SystemSettings'))
const SystemHealthMonitor = lazyWithPreload(() => import('@/components/admin/SystemHealthMonitor'))

// Wrap each component with the ErrorBoundary HOC
const AnalyticsWithBoundary = withErrorBoundary(Analytics)
const UserManagementWithBoundary = withErrorBoundary(UserManagement)
const PaymentVerificationWithBoundary = withErrorBoundary(PaymentVerification)
const ProductManagementWithBoundary = withErrorBoundary(ProductManagement)
const LinksManagementWithBoundary = withErrorBoundary(LinksManagement)
const SystemSettingsWithBoundary = withErrorBoundary(SystemSettings)
const SystemHealthMonitorWithBoundary = withErrorBoundary(SystemHealthMonitor)

const AdminDashboard: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList aria-label="Admin Dashboard Tabs">
            <TabsTrigger 
              value="analytics" 
              onMouseEnter={() => Analytics.preload()}
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              onMouseEnter={() => UserManagement.preload()}
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              onMouseEnter={() => ProductManagement.preload()}
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              onMouseEnter={() => PaymentVerification.preload()}
            >
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              onMouseEnter={() => LinksManagement.preload()}
            >
              Links
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onMouseEnter={() => SystemSettings.preload()}
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              onMouseEnter={() => SystemHealthMonitor.preload()}
            >
              System Health
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <AnalyticsWithBoundary />
            </Suspense>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <UserManagementWithBoundary />
            </Suspense>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductManagementWithBoundary />
            </Suspense>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <PaymentVerificationWithBoundary />
            </Suspense>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <LinksManagementWithBoundary />
            </Suspense>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <SystemSettingsWithBoundary />
            </Suspense>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <SystemHealthMonitorWithBoundary />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

export default AdminDashboard
