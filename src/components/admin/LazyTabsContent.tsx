// components/admin/LazyTabsContent.tsx
import React, { Suspense } from 'react'
import { TabsContent } from '@/components/ui/tabs'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

interface LazyTabsContentProps {
  value: string
  children: React.ReactNode
}

const LazyTabsContent: React.FC<LazyTabsContentProps> = ({ value, children }) => (
  <TabsContent value={value} className="space-y-4">
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  </TabsContent>
)

export default LazyTabsContent
