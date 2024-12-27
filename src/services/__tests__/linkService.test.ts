import { vi } from 'vitest'
import { supabase } from '@/integrations/supabase/client'
import { linkService } from '@/services/linkService'

describe('linkService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getActivePermanentLinks', () => {
    it('fetches active permanent links successfully', async () => {
      const mockLinks = [
        { id: 1, status: 'active', performance_score: 100 },
        { id: 2, status: 'active', performance_score: 90 },
      ]

      vi.spyOn(supabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ data: mockLinks, error: null }),
      }) as any)

      const result = await linkService.getActivePermanentLinks()
      expect(result).toEqual(mockLinks)
    })

    it('throws error when fetch fails', async () => {
      vi.spyOn(supabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') }),
      }) as any)

      await expect(linkService.getActivePermanentLinks()).rejects.toThrow('Fetch failed')
    })
  })
})