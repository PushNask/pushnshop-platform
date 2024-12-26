import type { CurrencyType } from './database/enums'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: CurrencyType
  created_at: string
  status: string
  seller_id: string
  expires_at: string | null
  seller?: {
    full_name: string | null
  }
}