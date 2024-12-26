import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { WhatsappIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  currency: string
  imageUrl?: string
  whatsappNumber?: string
  linkId: number
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
}: ProductCardProps) => {
  const { toast } = useToast()

  const handleWhatsAppClick = async () => {
    try {
      // Update performance score
      await supabase.rpc('increment_link_analytics', {
        p_link_id: linkId,
        p_column: 'whatsapp_click'
      })
      
      // Open WhatsApp
      const formattedNumber = whatsappNumber?.replace(/\D/g, '')
      const message = `Hi! I'm interested in your product: ${title}`
      window.open(
        `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`,
        '_blank'
      )
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to WhatsApp"
      })
    }
  }

  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
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
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleWhatsAppClick}
          disabled={!whatsappNumber}
        >
          <WhatsappIcon className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard