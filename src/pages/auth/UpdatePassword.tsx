import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we're in a password reset flow by verifying the presence of 'access_token'
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get('access_token')) {
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated.',
      })

      navigate('/login')
    } catch (err) {
      console.error('Update password error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update password')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update password. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/a45fc387-27b4-4558-9f48-5db5b9823e4d.png"
              alt="PushNshop Logo"
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-center text-2xl">Update Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                aria-label="New Password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                aria-label="Confirm New Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdatePassword
