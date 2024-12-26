import type { CurrencyType } from './database'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: CurrencyType
  created_at: string
  status: string
  seller: {
    full_name: string | null
  }
}

export interface ProductImage {
  id: string
  url: string
  alt: string | null
  product_id: string
}