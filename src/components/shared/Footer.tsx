import { Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const Footer = () => {
  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = "Check out PushNshop - Your local marketplace for quick and trusted transactions!"
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      instagram: `https://instagram.com` // Instagram doesn't support direct sharing, redirect to profile
    }
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare('facebook')}
                className="hover:text-blue-600"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare('twitter')}
                className="hover:text-blue-400"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare('instagram')}
                className="hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="flex flex-col space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm">
                    <p>Terms of service content will go here...</p>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm">
                    <p>Privacy policy content will go here...</p>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-gray-600 hover:text-gray-900">
                    Contact Us
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm">
                    <p>Contact information will go here...</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">About PushNshop</h3>
            <p className="text-sm text-gray-600 text-center md:text-left">
              Your local marketplace for quick and trusted transactions.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} PushNshop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer