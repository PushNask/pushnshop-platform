import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth/AuthProvider'
import Header from '../Header'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('Header', () => {
  it('renders logo and brand name', () => {
    renderWithProviders(<Header />)
    expect(screen.getByAltText('PushNshop')).toBeInTheDocument()
    expect(screen.getByText('PushNshop')).toBeInTheDocument()
  })

  it('shows login/signup links when not authenticated', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })
})