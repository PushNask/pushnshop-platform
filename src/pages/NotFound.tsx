import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="default">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound