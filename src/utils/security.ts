import { supabase } from '@/integrations/supabase/client'

export const generateCsrfToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data, error } = await supabase
    .from('csrf_tokens')
    .insert({
      user_id: session.user.id,
    })
    .select('token')
    .single()

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
    .from('csrf_tokens')
    .select('*')
    .eq('token', token)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return false

  // Delete used token
  await supabase
    .from('csrf_tokens')
    .delete()
    .eq('token', token)

  return true
}

export const checkRateLimit = async (email: string) => {
  const { data, error } = await supabase
    .rpc('check_login_attempts', { p_email: email })

  if (error) {
    console.error('Error checking rate limit:', error)
    return false
  }

  return data
}