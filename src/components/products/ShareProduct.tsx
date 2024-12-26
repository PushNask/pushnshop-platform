import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Share } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface ShareProductProps {
  productId: string
  title: string
  linkId?: number
}

const ShareProduct = ({ productId, title, linkId }: ShareProductProps) => {
  const { toast } = useToast()
  const currentUrl = window.location.href

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    try {
      // Update performance score if this is a permanent link
      if (linkId) {
        await supabase.rpc('increment_link_analytics', {
          p_link_id: linkId,
          p_column: 'share'
        })
      }

      // Handle different share platforms
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
            '_blank'
          )
          break
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
            '_blank'
          )
          break
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`,
            '_blank'
          )
          break
        case 'copy':
          await navigator.clipboard.writeText(currentUrl)
          toast({
            title: 'Link copied!',
            description: 'The product link has been copied to your clipboard.'
          })
          break
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not share the product'
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="w-full"
          >
            Share on Facebook
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="w-full"
          >
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('whatsapp')}
            className="w-full"
          >
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('copy')}
            className="w-full"
          >
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareProduct