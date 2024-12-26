import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductList from '@/components/seller/ProductList'
import CreateProduct from '@/components/seller/CreateProduct'
import SellerMetrics from '@/components/seller/SellerMetrics'
import { ProtectedRoute } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const SellerDashboard = () => {
  const { toast } = useToast()

  // Basic seller data query to ensure auth is working
  const { isLoading, error } = useQuery({
    queryKey: ['sellerProfile'],
    queryFn: async () => {
      const response = await fetch('/api/seller/profile')
      if (!response.ok) {
        throw new Error('Failed to load seller profile')
      }
      return response.json()
    },
    retry: 1,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: "Please try refreshing the page."
      })
    }
  })

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Failed to load the dashboard. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default SellerDashboard