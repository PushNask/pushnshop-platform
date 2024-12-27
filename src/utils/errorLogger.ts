import { toast } from '@/hooks/use-toast'

export const logError = (
  error: unknown,
  context: string,
  userId?: string | null
) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(`[${context}] Error:`, {
    message: errorMessage,
    userId,
    timestamp: new Date().toISOString(),
  })
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