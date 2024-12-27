import { Link } from 'react-router-dom'
import { Globe, User, LogIn, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeaderUserMenu } from './HeaderUserMenu'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database/enums'

interface HeaderNavProps {
  user: User | null
  userRole: UserRole | null
  isAdminRoute: boolean
}

export const HeaderNav = ({ user, userRole, isAdminRoute }: HeaderNavProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {isAdminRoute && userRole === 'admin' && (
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </Link>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900"
      >
        <Globe className="h-5 w-5" />
      </Button>

      {user ? (
        <HeaderUserMenu user={user} userRole={userRole} />
      ) : (
        <Link to="/login">
          <Button variant="default" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
      )}
    </div>
  )
}