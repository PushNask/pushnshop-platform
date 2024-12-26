import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders footer content', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )
    expect(screen.getByText(/© \d{4} PushNshop/)).toBeInTheDocument()
  })
})