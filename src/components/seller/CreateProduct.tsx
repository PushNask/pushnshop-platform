import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useAuth } from '@/contexts/auth/AuthProvider'
import { Upload } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductBasicInfo } from './product-creation/ProductBasicInfo'
import { ProductPricing } from './product-creation/ProductPricing'
import { ProductImageUpload } from './product-creation/ProductImageUpload'
import { productSchema } from './product-creation/types'
import type { ProductFormData } from './product-creation/types'

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
        <ProductBasicInfo form={form} />
        <ProductPricing form={form} />
        <ProductImageUpload form={form} />

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