import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductList from '@/components/seller/ProductList'
import CreateProduct from '@/components/seller/CreateProduct'
import SellerMetrics from '@/components/seller/SellerMetrics'
import { ProtectedRoute } from '@/contexts/AuthContext'

const SellerDashboard = () => {
  const { toast } = useToast()

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        
        <SellerMetrics />

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="create">Create Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductList />
          </TabsContent>
          
          <TabsContent value="create">
            <CreateProduct />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

export default SellerDashboard