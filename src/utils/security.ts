import { supabase } from '@/integrations/supabase/client'

export const generateCsrfToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data, error } = await supabase
    .rpc('generate_csrf_token', {
      p_user_id: session.user.id
    })

  if (error) {
    console.error('Error generating CSRF token:', error)
    return null
  }

  return data.token
}

export const validateCsrfToken = async (token: string) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return false

  const { data, error } = await supabase
    .rpc('validate_csrf_token', {
      p_token: token,
      p_user_id: session.user.id
    })

  if (error) {
    console.error('Error validating CSRF token:', error)
    return false
  }

  return data
}

export const checkRateLimit = async (email: string) => {
  const { data, error } = await supabase
    .rpc('check_login_attempts', { 
      p_email: email,
      p_window_minutes: 15,
      p_max_attempts: 5
    })

  if (error) {
    console.error('Error checking rate limit:', error)
    return false
  }

  return data
}