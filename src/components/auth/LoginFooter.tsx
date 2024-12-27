import { Link } from 'react-router-dom'

const LoginFooter = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm text-right">
        <Link
          to="/reset-password"
          className="text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginFooter