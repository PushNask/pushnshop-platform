import { Link } from 'react-router-dom'
import { Menu, X, Globe, Home, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth/AuthProvider'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types/database/enums'

interface HeaderMobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  userRole: UserRole | null
  isAdminRoute: boolean
}

export const HeaderMobileNav = ({ 
  isOpen, 
  setIsOpen,
  user,
  userRole,
  isAdminRoute 
}: HeaderMobileNavProps) => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-white border-b border-gray-200 px-4 py-2">
          <div className="space-y-2">
            {isAdminRoute && userRole === 'admin' && (
              <Link to="/" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <Globe className="h-5 w-5 mr-2" />
              Language
            </Button>

            {user ? (
              <>
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.email}
                </div>
                {userRole === 'seller' && (
                  <Link to="/seller" className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Seller Dashboard
                    </Button>
                  </Link>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin" className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" className="block">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}