import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProductManagement } from '@/components/admin/ProductManagement'
import { PaymentVerification } from '@/components/admin/PaymentVerification'
import { LinksManagement } from '@/components/admin/LinksManagement'
import { UserManagement } from '@/components/admin/UserManagement'
import { Analytics } from '@/components/admin/Analytics'
import { SystemSettings } from '@/components/admin/SystemSettings'
import { Navigate } from 'react-router-dom'
import type { AdminMetrics } from '@/types/admin'

const AdminDashboard = () => {
  const { userRole } = useAuth()
  const { toast } = useToast()

  // Redirect if not admin
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  const { data: metrics, error } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_metrics', {
        time_range: '24h'
      })
      if (error) throw error
      return data as unknown as AdminMetrics
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching metrics",
        description: "Please try again later or contact support."
      })
    }
  }, [error, toast])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.overview?.pendingProducts || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.overview?.pendingPayments || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XAF'
              }).format(metrics?.overview?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Alert if needed */}
      {metrics?.overview?.systemHealth === 'Warning' && (
        <Alert>
          <AlertDescription>
            System performance is degraded. Check System Settings for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentVerification />
        </TabsContent>
        <TabsContent value="links">
          <LinksManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard