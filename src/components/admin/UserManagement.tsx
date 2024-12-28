import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { UserTable } from './UserTable'
import { getWhatsAppError } from '@/utils/validation'

const UserManagement = () => {
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
      <UserTable users={users} onRoleUpdate={handleRoleUpdate} />
    </div>
  )
}

export default UserManagement;
