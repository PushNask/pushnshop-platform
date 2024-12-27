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

export const handleAuthError = (error: unknown, context: string) => {
  logError(error, context)
  
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  
  toast({
    variant: 'destructive',
    title: 'Authentication Error',
    description: message,
  })
}

export const handlePaymentError = (error: unknown, context: string) => {
  logError(error, context)
  
  toast({
    variant: 'destructive',
    title: 'Payment Error',
    description: 'Failed to process payment. Please try again.',
  })
}

export const handleUploadError = (error: unknown, context: string) => {
  logError(error, context)
  
  toast({
    variant: 'destructive',
    title: 'Upload Error',
    description: 'Failed to upload file. Please try again.',
  })
}