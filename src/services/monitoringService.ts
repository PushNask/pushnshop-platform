import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

export const monitoringService = {
  async checkSystemHealth() {
    try {
      const startTime = performance.now()
      
      // Check Supabase connection
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .limit(1)
      
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      if (error) throw error

      // Update system metrics
      await supabase
        .from('system_metrics')
        .insert({
          cpu_usage: 0, // We'll get this from the server
          memory_usage: 0, // We'll get this from the server
          response_time: responseTime,
          error_rate: 0,
          active_users: 0 // This will be updated by the server
        })

      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('System health check failed:', error)
      toast({
        variant: "destructive",
        title: "System Health Check Failed",
        description: "Please contact support if this persists."
      })
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  },

  async trackError(error: Error, context: string) {
    try {
      console.error(`Error in ${context}:`, error)
      
      // Here we could integrate with error tracking services like Sentry
      // For now, we'll just log to console and show a toast
      
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message
      })
    } catch (e) {
      console.error('Error tracking failed:', e)
    }
  }
}