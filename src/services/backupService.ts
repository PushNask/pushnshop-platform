import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type TableNames = keyof Database['public']['Tables']

export const backupService = {
  async exportData() {
    try {
      // Export critical tables
      const tables: TableNames[] = ['products', 'permanent_links', 'payments']
      const exports = await Promise.all(
        tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .select('*')
          
          if (error) throw error
          
          return {
            table,
            data
          }
        })
      )

      // Create backup file
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: exports
      }

      // Download as JSON
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pushnshop-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Backup Created",
        description: "Your data has been exported successfully."
      })
    } catch (error) {
      console.error('Backup failed:', error)
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "Please try again or contact support."
      })
    }
  }
}