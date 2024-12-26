import { useState, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export const useProductTimer = (productId: string) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  const queryClient = useQueryClient()

  // Fetch product expiry time
  const { data: product } = useQuery({
    queryKey: ['product-expiry', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('created_at, expires_at')
        .eq('id', productId)
        .single()

      if (error) throw error
      return data
    }
  })

  // Memoize expiry calculation
  const expiryTime = useMemo(() => {
    if (!product?.expires_at) return null
    return new Date(product.expires_at).getTime()
  }, [product?.expires_at])

  useEffect(() => {
    if (!expiryTime) return

    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const distance = expiryTime - now

      if (distance <= 0) {
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        isExpired: false
      })
    }

    // Initial calculation
    calculateTimeRemaining()

    // Update every second
    const timer = setInterval(calculateTimeRemaining, 1000)

    // Handle product expiry
    const expiryTimer = setTimeout(async () => {
      // Invalidate queries to refresh product status
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-expiry', productId] })
    }, expiryTime - new Date().getTime())

    return () => {
      clearInterval(timer)
      clearTimeout(expiryTimer)
    }
  }, [expiryTime, productId, queryClient])

  return timeRemaining
}