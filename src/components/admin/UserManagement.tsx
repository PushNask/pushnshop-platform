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
import { validateWhatsAppNumber, getWhatsAppError } from '@/utils/validation'
import { AlertTriangle } from 'lucide-react'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'

export const UserManagement = () => {
  const { toast } = useToast()

  const { data: users, refetch, error, isLoading } = useQuery({
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
      const user = users?.find(u => u.id === userId)
      
      // Validate WhatsApp number for sellers
      if (newRole === 'seller' && user?.whatsapp_number) {
        const whatsappError = getWhatsAppError(user.whatsapp_number)
        if (whatsappError) {
          toast({
            variant: "destructive",
            title: "Invalid WhatsApp Number",
            description: whatsappError
          })
          return
        }
      }

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load users. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
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
          {users?.map((user) => {
            const whatsappError = user.whatsapp_number ? getWhatsAppError(user.whatsapp_number) : null
            
            return (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell className="relative">
                  {user.whatsapp_number}
                  {whatsappError && user.role === 'seller' && (
                    <span className="text-xs text-red-500 block">
                      {whatsappError}
                    </span>
                  )}
                </TableCell>
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
                        disabled={user.role === 'seller' && whatsappError !== null}
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}