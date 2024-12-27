import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Analytics } from '@/components/admin/Analytics'
import { UserManagement } from '@/components/admin/UserManagement'
import { PaymentVerification } from '@/components/admin/PaymentVerification'
import { ProductManagement } from '@/components/admin/ProductManagement'
import { LinksManagement } from '@/components/admin/LinksManagement'
import { SystemSettings } from '@/components/admin/SystemSettings'
import { SystemHealthMonitor } from '@/components/admin/SystemHealthMonitor'

const AdminDashboard = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <Analytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentVerification />
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <LinksManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <SystemHealthMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

export default AdminDashboard