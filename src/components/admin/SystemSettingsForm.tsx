import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const systemSettingsSchema = z.object({
  commission_rate: z.number().min(0).max(100),
  min_product_price: z.number().min(0),
  max_product_price: z.number().min(0),
  default_duration_hours: z.number().min(1),
})

type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>

export const SystemSettingsForm = () => {
  const { toast } = useToast()

  const form = useForm<SystemSettingsFormData>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      commission_rate: 0,
      min_product_price: 0,
      max_product_price: 0,
      default_duration_hours: 24,
    },
  })

  const { data: settings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_settings')
      if (error) throw error
      return data as unknown as SystemSettingsFormData
    }
  })

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (data: SystemSettingsFormData) => {
      const { error } = await supabase.rpc('update_system_settings', {
        p_commission_rate: data.commission_rate,
        p_min_product_price: data.min_product_price,
        p_max_product_price: data.max_product_price,
        p_default_duration_hours: data.default_duration_hours,
      })
      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully."
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update system settings."
      })
    }
  })

  const onSubmit = (data: SystemSettingsFormData) => {
    updateSettings(data)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
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
                <FormLabel>Minimum Product Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
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
                <FormLabel>Maximum Product Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
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
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    </div>
  )
}