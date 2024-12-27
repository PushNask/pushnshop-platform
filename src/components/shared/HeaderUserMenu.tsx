import { useAuth } from '@/contexts/auth/AuthProvider'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database/enums'

interface HeaderUserMenuProps {
  user: SupabaseUser
  userRole: UserRole | null
}

export const HeaderUserMenu = ({ user, userRole }: HeaderUserMenuProps) => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-gray-900"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">
          {user.email}
        </div>
        <DropdownMenuSeparator />
        {userRole === 'seller' && (
          <DropdownMenuItem asChild>
            <Link to="/seller" className="w-full">
              Seller Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {userRole === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="w-full">
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}