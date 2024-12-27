import { toast } from '@/hooks/use-toast'

export const logError = (
  error: unknown,
  context: string,
  userId?: string | null
) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const timestamp = new Date().toISOString()
  
  // Log to console for development
  console.error(`[${context}] Error:`, {
    message: errorMessage,
    userId,
    timestamp,
    stack: error instanceof Error ? error.stack : undefined
  })

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement production error logging
    // This could be Sentry, LogRocket, or your own logging service
  }
}