import { Link } from 'react-router-dom'

const LoginHeader = () => {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <img
          src="/lovable-uploads/a45fc387-27b4-4558-9f48-5db5b9823e4d.png"
          alt="PushNshop Logo"
          className="h-16 w-16"
        />
      </div>
      <h2 className="text-center text-2xl font-bold">Welcome back</h2>
      <p className="text-center text-sm text-muted-foreground">
        Enter your credentials to access your account
      </p>
    </div>
  )
}

export default LoginHeader