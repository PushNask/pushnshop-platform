import { supabase } from './client'

export const generateCsrfToken = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('generate_csrf_token', {
      p_user_id: userId
    })

  if (error) throw error
  return { token: data as string }
}

export const validateCsrfToken = async (token: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('validate_csrf_token', {
      p_token: token,
      p_user_id: userId
    })

  if (error) throw error
  return data
}