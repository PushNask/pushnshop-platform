import type { CurrencyType } from './database/enums'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: CurrencyType
  created_at: string
  seller_id: string
  seller?: {
    full_name: string | null
  }
}