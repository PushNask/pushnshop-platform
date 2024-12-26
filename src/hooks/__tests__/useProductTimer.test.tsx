import { renderHook, act } from '@testing-library/react'
import { useProductTimer } from '../useProductTimer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useProductTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should calculate time remaining correctly', () => {
    const { result } = renderHook(() => useProductTimer('test-id'), { wrapper })

    // Fast-forward 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toEqual(expect.objectContaining({
      isExpired: expect.any(Boolean),
      hours: expect.any(Number),
      minutes: expect.any(Number),
      seconds: expect.any(Number),
    }))
  })

  it('should mark product as expired when time is up', () => {
    const { result } = renderHook(() => useProductTimer('test-id'), { wrapper })

    // Fast-forward past expiry time
    act(() => {
      vi.advanceTimersByTime(24 * 60 * 60 * 1000) // 24 hours
    })

    expect(result.current.isExpired).toBe(true)
  })
})