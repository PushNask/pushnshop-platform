import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  currency: string
  imageUrl?: string
  whatsappNumber?: string
  linkId: number
  showActions?: boolean
}

const ProductCard = ({
  id,
  title,
  description,
  price,
  currency,
  imageUrl,
  whatsappNumber,
  linkId,
  showActions = false,
}: ProductCardProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleWhatsAppClick = async () => {
    try {
      // Update performance score if this is a permanent link
      if (linkId > 0) {
        await supabase.rpc('increment_link_analytics', {
          p_link_id: linkId,
          p_column: 'whatsapp_click'
        })
      }
      
      // Open WhatsApp
      const formattedNumber = whatsappNumber?.replace(/\D/g, '')
      const message = `Hi! I'm interested in your product: ${title}`
      window.open(
        `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`,
        '_blank'
      )
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to WhatsApp'
      })
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Product deleted successfully'
      })

      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product'
      })
    }
  }

  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
      <Link to={`/details/${id}`} className="flex-grow">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-3">
            {description}
          </p>
          <p className="text-lg font-bold">
            {price.toLocaleString()} {currency}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 space-x-2">
        {showActions ? (
          <>
            <Link to={`/seller/products/edit/${id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={handleWhatsAppClick}
            disabled={!whatsappNumber}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard