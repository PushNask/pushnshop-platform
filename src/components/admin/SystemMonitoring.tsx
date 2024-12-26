import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'
import type { SystemMetrics } from '@/types/admin'

export const SystemMonitoring = () => {
  const { data: metrics, error, isLoading } = useQuery<SystemMetrics>({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_metrics')
      if (error) throw error
      
      // First cast to unknown
      const unknownData = data as unknown
      
      // Type guard function to validate the shape of the data
      const isSystemMetrics = (data: unknown): data is SystemMetrics => {
        if (!data || typeof data !== 'object') return false
        const d = data as Record<string, unknown>
        return (
          typeof d.cpu === 'number' &&
          typeof d.memory === 'number' &&
          typeof d.response_time === 'number' &&
          typeof d.error_rate === 'number' &&
          typeof d.active_users === 'number'
        )
      }

      // Validate and cast the data
      if (!isSystemMetrics(unknownData)) {
        throw new Error('Invalid system metrics data format')
      }

      return unknownData
    },
    refetchInterval: 60000, // Refresh every minute
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load system metrics. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.response_time}ms</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.error_rate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            {metrics.active_users} users online
          </div>
        </CardContent>
      </Card>
    </div>
  )
}