import { Button } from '@/components/ui/button'
import type { User } from '@/types/database'

interface UserRoleActionsProps {
  user: User
  onRoleUpdate: (userId: string, newRole: 'seller' | 'buyer') => Promise<void>
  isDisabled?: boolean
}

export const UserRoleActions = ({ user, onRoleUpdate, isDisabled }: UserRoleActionsProps) => {
  if (user.role === 'admin') return null

  return (
    <div className="space-x-2">
      <Button
        onClick={() => onRoleUpdate(user.id, 'seller')}
        size="sm"
        variant={user.role === 'seller' ? 'default' : 'outline'}
        disabled={isDisabled}
      >
        Seller
      </Button>
      <Button
        onClick={() => onRoleUpdate(user.id, 'buyer')}
        size="sm"
        variant={user.role === 'buyer' ? 'default' : 'outline'}
      >
        Buyer
      </Button>
    </div>
  )
}