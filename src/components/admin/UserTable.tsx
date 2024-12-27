import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserRoleActions } from './UserRoleActions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { getWhatsAppError } from '@/utils/validation'
import type { User } from '@/types/database'

interface UserTableProps {
  users: User[] | undefined
  onRoleUpdate: (userId: string, newRole: 'seller' | 'buyer') => Promise<void>
}

export const UserTable = ({ users, onRoleUpdate }: UserTableProps) => {
  if (!users?.length) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No users found.</AlertDescription>
      </Alert>
    )
  }

  return (
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
        {users.map((user) => {
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
              <TableCell>
                <UserRoleActions 
                  user={user}
                  onRoleUpdate={onRoleUpdate}
                  isDisabled={user.role === 'seller' && whatsappError !== null}
                />
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  )
}