import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { useToast } from '@/hooks/use-toast'

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before timeout

export const useSessionTimeout = () => {
  const { signOut, session } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!session) return

    // Use session.expires_at instead of created_at
    const timeoutAt = new Date(session.expires_at).getTime()
    const warningAt = timeoutAt - WARNING_TIME

    // Show warning before session expires
    const warningTimeout = setTimeout(() => {
      toast({
        title: 'Session Expiring',
        description: 'Your session will expire in 5 minutes. Please save your work.',
        duration: 10000,
      })
    }, Math.max(0, warningAt - Date.now()))

    // Sign out when session expires
    const sessionTimeout = setTimeout(() => {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please sign in again.',
        duration: 5000,
      })
      signOut()
    }, Math.max(0, timeoutAt - Date.now()))

    return () => {
      clearTimeout(warningTimeout)
      clearTimeout(sessionTimeout)
    }
  }, [session, signOut, toast])
}