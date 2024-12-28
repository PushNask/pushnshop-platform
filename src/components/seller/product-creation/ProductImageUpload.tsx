import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'
import type { ProductFormData } from './types'

interface ProductImageUploadProps {
  form: UseFormReturn<ProductFormData>
}

export const ProductImageUpload = ({ form }: ProductImageUploadProps) => {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormLabel>Images (up to 7)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={e => onChange(e.target.files)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}