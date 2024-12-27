export interface User {
  id: string
  full_name: string | null
  whatsapp_number: string | null
  role: 'admin' | 'seller' | 'buyer'
  created_at: string
}