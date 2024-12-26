import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemMetrics } from '@/types/admin'

export const SystemSettings = () => {
  const { data: metrics } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_metrics')
      if (error) throw error
      return data as unknown as SystemMetrics
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.cpu}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.memory}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.active_users}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Response Time</p>
              <p className="text-2xl font-bold">{metrics?.response_time}ms</p>
            </div>
            <div>
              <p className="text-sm font-medium">Error Rate</p>
              <p className="text-2xl font-bold">{metrics?.error_rate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}