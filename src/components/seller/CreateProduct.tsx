import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/AuthContext'
import { Upload } from 'lucide-react'

interface ProductFormData {
  title: string
  description: string
  price: number
  images: FileList
}

const CreateProduct = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true)

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          seller_id: user?.id,
        })
        .select()
        .single()

      if (productError) throw productError

      // Upload images
      const files = Array.from(data.images).slice(0, 7)
      const imagePromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${product.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        return supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            url: publicUrl,
            alt: data.title,
          })
      })

      await Promise.all(imagePromises)

      toast({
        title: "Success",
        description: "Product created successfully"
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (XAF)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  onChange={(e) => onChange(e.target.files)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={uploading}>
          {uploading ? (
            'Creating Product...'
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Create Product
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateProduct