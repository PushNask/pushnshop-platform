import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: any[];
  FallbackComponent?: React.ComponentType<{
    error: Error;
    resetErrorBoundary: () => void;
  }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const isNetworkError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection')
  );
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.resetKeys) {
      if (!prevProps.resetKeys || 
          JSON.stringify(prevProps.resetKeys) !== JSON.stringify(this.props.resetKeys)) {
        this.handleRetry();
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  renderErrorUI(error: Error | null) {
    if (this.props.FallbackComponent) {
      const FallbackComponent = this.props.FallbackComponent;
      return <FallbackComponent error={error!} resetErrorBoundary={this.handleRetry} />;
    }

    const errorMessage = error?.message || 'An unexpected error occurred';
    const isNetwork = error ? isNetworkError(error) : false;

    return (
      <div className="p-4 space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {isNetwork
              ? 'Unable to connect to the server. Please check your internet connection.'
              : errorMessage}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={this.handleRetry} 
          className="w-full flex items-center justify-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return this.renderErrorUI(this.state.error);
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Default export for backward compatibility
export default ErrorBoundary;