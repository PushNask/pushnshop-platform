import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from './components/shared/Header'
import HomePage from './pages/HomePage'
import ProductDetails from './pages/ProductDetails'
import PermanentLinkDetails from './pages/PermanentLinkDetails'
import SellerDashboard from './pages/SellerDashboard'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/details/:id" element={<ProductDetails />} />
            <Route path="/p:linkNumber/details" element={<PermanentLinkDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App