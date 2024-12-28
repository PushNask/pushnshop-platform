import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { monitoringService } from '@/services/monitoringService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const SystemHealthMonitor = () => {
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  const { data: healthStatus, isLoading, error } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: monitoringService.checkSystemHealth,
    refetchInterval: 300000, // Check every 5 minutes
  })

  useEffect(() => {
    if (healthStatus) {
      setLastCheck(new Date())
    }
  }, [healthStatus])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to fetch system health status
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            healthStatus?.status === 'healthy' ? 'text-green-500' : 'text-red-500'
          }`}>
            {healthStatus?.status === 'healthy' ? 'Healthy' : 'Issues Detected'}
          </div>
          <p className="text-xs text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {healthStatus?.responseTime}ms
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {/* This will be populated by the server */}
            --
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SystemHealthMonitor;
