import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const ProductManagement = () => {
  const { toast } = useToast()

  const { data: products, refetch } = useQuery({
    queryKey: ['pendingProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:users(full_name)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const handleApprove = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('id', productId)

      if (error) throw error

      toast({
        title: "Product approved",
        description: "The product has been approved successfully."
      })
      
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error approving product",
        description: "Please try again later."
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Product Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.seller?.full_name}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: product.currency || 'XAF'
                }).format(product.price)}
              </TableCell>
              <TableCell>
                {new Date(product.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleApprove(product.id)}
                  size="sm"
                >
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}