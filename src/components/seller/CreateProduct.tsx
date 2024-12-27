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
import { useAuth } from '@/contexts/auth/AuthProvider'
import { Upload } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 7;

const productSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .transform(val => val.replace(/<[^>]*>/g, '')), // Strip HTML
  price: z.number()
    .min(1000, 'Minimum price is 1000 XAF')
    .max(1000000, 'Maximum price is 1000000 XAF'),
  duration: z.number()
    .min(24, 'Duration must be between 24 and 720 hours')
    .max(720, 'Duration must be between 24 and 720 hours'),
  images: z.instanceof(FileList)
    .refine(files => files.length <= MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
    .refine(files => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_FILE_SIZE) return false;
      }
      return true;
    }, 'Each image must be less than 5MB')
    .refine(files => {
      for (let i = 0; i < files.length; i++) {
        if (!ALLOWED_FILE_TYPES.includes(files[i].type)) return false;
      }
      return true;
    }, 'Only JPG, PNG and WebP images are allowed')
});

type ProductFormData = z.infer<typeof productSchema>;

const CreateProduct = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 1000,
      duration: 168, // 1 week default
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
          expires_at: new Date(Date.now() + (data.duration * 60 * 60 * 1000)).toISOString(),
        })
        .select()
        .single()

      if (productError) throw productError

      // Upload images
      const files = Array.from(data.images).slice(0, MAX_IMAGES)
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
      console.error('Error creating product:', error)
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
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (hours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
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
                  onChange={e => onChange(e.target.files)}
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