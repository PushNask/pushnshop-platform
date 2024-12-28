// components/shared/LoadingSpinner.tsx

import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
    <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">Loading...</span>
  </div>
)

export default LoadingSpinner
