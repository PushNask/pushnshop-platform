import { generateCsrfToken, validateCsrfToken } from '@/integrations/supabase/functions'

export const getCsrfToken = async (userId: string) => {
  try {
    const { token } = await generateCsrfToken(userId)
    return token
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    throw error
  }
}

export const verifyCsrfToken = async (token: string, userId: string) => {
  try {
    const isValid = await validateCsrfToken(token, userId)
    return isValid
  } catch (error) {
    console.error('Error validating CSRF token:', error)
    throw error
  }
}