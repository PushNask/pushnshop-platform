import { render, screen, fireEvent } from '@testing-library/react'
import ShareProduct from '../ShareProduct'

describe('ShareProduct', () => {
  it('renders share button', () => {
    render(<ShareProduct productId="1" title="Test Product" />)
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('opens share dialog when clicked', () => {
    render(<ShareProduct productId="1" title="Test Product" />)
    fireEvent.click(screen.getByText('Share'))
    expect(screen.getByText('Share this product')).toBeInTheDocument()
    expect(screen.getByText('Share on Facebook')).toBeInTheDocument()
    expect(screen.getByText('Share on Twitter')).toBeInTheDocument()
    expect(screen.getByText('Share on WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
  })
})