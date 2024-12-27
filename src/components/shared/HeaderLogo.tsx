import { Link } from 'react-router-dom'

export const HeaderLogo = () => {
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="flex items-center">
        <img
          className="h-8 w-8 rounded-full"
          src="/lovable-uploads/749d521e-3df7-4d22-8f0d-66f311047aa2.png"
          alt="PushNshop"
        />
        <span className="ml-2 text-xl font-bold text-gray-900">
          PushNshop
        </span>
      </Link>
    </div>
  )
}