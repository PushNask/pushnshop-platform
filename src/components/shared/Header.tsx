import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe, User, LogIn, Home } from 'lucide-react'
import { useAuth } from '@/contexts/auth/AuthProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HeaderNav } from './HeaderNav'
import { HeaderMobileNav } from './HeaderMobileNav'
import { HeaderLogo } from './HeaderLogo'
import { HeaderUserMenu } from './HeaderUserMenu'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, userRole } = useAuth()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <HeaderLogo />
          <HeaderNav user={user} userRole={userRole} isAdminRoute={isAdminRoute} />
          <HeaderMobileNav 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            user={user} 
            userRole={userRole} 
            isAdminRoute={isAdminRoute} 
          />
        </div>
      </nav>
    </header>
  )
}

export default Header