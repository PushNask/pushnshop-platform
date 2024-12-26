import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProductCard from '../ProductCard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockProduct = {
  id: '1',
  title: 'Test Product',
  description: 'Test Description',
  price: 1000,
  currency: 'XAF',
  imageUrl: 'test.jpg',
  whatsappNumber: '+1234567890',
  linkId: 1,
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(
      <ProductCard {...mockProduct} />
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('1,000 XAF')).toBeInTheDocument()
  })

  it('shows edit/delete buttons when showActions is true', () => {
    renderWithProviders(
      <ProductCard {...mockProduct} showActions={true} />
    )

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('shows contact seller button when showActions is false', () => {
    renderWithProviders(
      <ProductCard {...mockProduct} showActions={false} />
    )

    expect(screen.getByText('Contact Seller')).toBeInTheDocument()
  })
})