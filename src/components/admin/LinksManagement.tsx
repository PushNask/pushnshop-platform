import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const LinksManagement = () => {
  const { data: links } = useQuery({
    queryKey: ['permanentLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_links')
        .select(`
          *,
          product:products(
            title,
            seller:users(full_name)
          )
        `)
        .order('performance_score', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Links Management</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Available Links</h3>
          <p className="text-2xl font-bold">
            {links?.filter(l => l.status === 'available').length || 0}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Active Links</h3>
          <p className="text-2xl font-bold">
            {links?.filter(l => l.status === 'active').length || 0}
          </p>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Link #</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Performance Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links?.map((link) => (
            <TableRow key={link.id}>
              <TableCell>p{link.id}</TableCell>
              <TableCell>{link.product?.title || 'No product'}</TableCell>
              <TableCell>{link.product?.seller?.full_name || '-'}</TableCell>
              <TableCell>{link.performance_score}</TableCell>
              <TableCell>{link.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LinksManagement;
