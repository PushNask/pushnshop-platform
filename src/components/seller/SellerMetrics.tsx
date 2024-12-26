import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const SellerMetrics = () => {
  const { user } = useAuth()

  const { data: metrics } = useQuery({
    queryKey: ['seller-metrics', user?.id],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user?.id)

      if (productsError) throw productsError

      const { data: links, error: linksError } = await supabase
        .from('permanent_links')
        .select('performance_score')
        .in('product_id', products.map(p => p.id))

      if (linksError) throw linksError

      return {
        totalProducts: products.length,
        totalPerformance: links.reduce((sum, link) => sum + (link.performance_score || 0), 0),
        averagePerformance: links.length 
          ? links.reduce((sum, link) => sum + (link.performance_score || 0), 0) / links.length 
          : 0
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalProducts || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Performance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalPerformance || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.averagePerformance.toFixed(2) || '0.00'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SellerMetrics