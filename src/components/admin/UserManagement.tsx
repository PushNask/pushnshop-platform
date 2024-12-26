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

export const UserManagement = () => {
  const { toast } = useToast()

  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const handleRoleUpdate = async (userId: string, newRole: 'seller' | 'buyer') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Role updated",
        description: "User role has been updated successfully."
      })
      
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: "Please try again later."
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.whatsapp_number}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                {user.role !== 'admin' && (
                  <>
                    <Button
                      onClick={() => handleRoleUpdate(user.id, 'seller')}
                      size="sm"
                      variant={user.role === 'seller' ? 'default' : 'outline'}
                    >
                      Seller
                    </Button>
                    <Button
                      onClick={() => handleRoleUpdate(user.id, 'buyer')}
                      size="sm"
                      variant={user.role === 'buyer' ? 'default' : 'outline'}
                    >
                      Buyer
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}