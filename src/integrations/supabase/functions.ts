import { supabase } from './client'

export const generateCsrfTokenRpc = async (userId: string) => {
  const { data, error } = await supabase.rpc('generate_csrf_token', {
    p_user_id: userId
  })
  
  if (error) throw error
  return data
}

export const validateCsrfTokenRpc = async (token: string, userId: string) => {
  const { data, error } = await supabase.rpc('validate_csrf_token', {
    p_token: token,
    p_user_id: userId
  })
  
  if (error) throw error
  return data
}

export const checkLoginAttemptsRpc = async (email: string) => {
  const { data, error } = await supabase.rpc('check_login_attempts', {
    p_email: email
  })
  
  if (error) throw error
  return data
}