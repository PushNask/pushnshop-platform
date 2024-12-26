import React from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemSettingsFormData } from '@/types/settings'

export const SystemSettingsForm = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_settings')
      if (error) throw error
      return data as SystemSettingsFormData
    }
  })

  const form = useForm<SystemSettingsFormData>({
    defaultValues: {
      commission_rate: 5,
      min_product_price: 1000,
      max_product_price: 1000000,
      default_duration_hours: 168
    }
  })

  const updateSettings = useMutation({
    mutationFn: async (data: SystemSettingsFormData) => {
      const { data: result, error } = await supabase.rpc('update_system_settings', {
        p_commission_rate: data.commission_rate,
        p_min_product_price: data.min_product_price,
        p_max_product_price: data.max_product_price,
        p_default_duration_hours: data.default_duration_hours
      })
      if (error) throw error
      return result
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully."
      })
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings. Please try again."
      })
      console.error('Error updating settings:', error)
    }
  })

  const onSubmit = (data: SystemSettingsFormData) => {
    updateSettings.mutate(data)
  }

  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset(settings)
    }
  }, [settings, form])

  if (isLoading) {
    return <div>Loading settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="commission_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_product_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Product Price (XAF)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_product_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Product Price (XAF)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_duration_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Duration (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? 'Updating...' : 'Update Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
