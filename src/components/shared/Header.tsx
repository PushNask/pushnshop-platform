import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Globe, User, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/placeholder.svg"
                alt="PushNshop"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                PushNshop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-5 w-5" />
            </Button>

            {user ? (
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
                  {user.role === 'seller' && (
                    <DropdownMenuItem asChild>
                      <Link to="/seller" className="w-full">
                        Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
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
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
                  {user.role === 'seller' && (
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
                  {user.role === 'admin' && (
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
      </nav>
    </header>
  )
}

export default Header