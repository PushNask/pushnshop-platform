import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import LoginForm from '../LoginForm'
import { useAuth } from '@/contexts/auth/AuthProvider'

// Mock useAuth hook
vi.mock('@/contexts/auth/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

describe('LoginForm', () => {
  const mockSignIn = vi.fn()

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      user: null,
    })
  })

  it('renders login form correctly', () => {
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('handles form submission correctly', async () => {
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows loading state during submission', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText(/signing in/i)).toBeInTheDocument()
  })
})