import React, { Suspense } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface LazyTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  keepMounted?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const LazyTabsContent: React.FC<LazyTabsContentProps> = ({
  value,
  children,
  className = 'space-y-4',
  keepMounted = false,
  onError
}) => (
  <TabsContent 
    value={value} 
    className={className}
    forceMount={keepMounted || undefined}
  >
    <ErrorBoundary onError={onError}>
      <Suspense fallback={<LoadingSpinner fullScreen={false} size="md" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  </TabsContent>
);

export default React.memo(LazyTabsContent);