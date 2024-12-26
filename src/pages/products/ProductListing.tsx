import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import ProductCard from '@/components/products/ProductCard'
import { Loader2 } from 'lucide-react'
import type { Database } from '@/integrations/supabase/types'

type Product = Database['public']['Tables']['products']['Row'] & {
  images: { url: string }[]
  seller: {
    whatsapp_number: string | null
  }
}

const ITEMS_PER_PAGE = 12

const ProductListing = ({ sellerView = false }) => {
  const { user, userRole } = useAuth()
  const { toast } = useToast()
  const { ref, inView } = useInView()

  const fetchProducts = async ({ pageParam = 0 }) => {
    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images (
          url
        ),
        seller:users (
          whatsapp_number
        )
      `)
      .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)
      .order('created_at', { ascending: false })

    // If in seller view, only show their products
    if (sellerView && user) {
      query = query.eq('seller_id', user.id)
    } else {
      // In public view, only show active products
      query = query.eq('status', 'active')
    }

    const { data, error } = await query

    if (error) throw error
    return data as Product[]
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ['products', sellerView, user?.id],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined
    },
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (status === 'error') {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error?.message || 'Failed to load products'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((group, i) => (
          <div key={i} className="contents">
            {group.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                currency={product.currency}
                imageUrl={product.images?.[0]?.url}
                whatsappNumber={product.seller?.whatsapp_number}
                linkId={0} // This will be set when used with permanent links
                showActions={sellerView}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div
        ref={ref}
        className="flex justify-center p-4"
      >
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
      </div>
    </div>
  )
}

export default ProductListing