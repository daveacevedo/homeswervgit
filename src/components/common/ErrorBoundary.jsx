import React from 'react';
import { useError } from '../../contexts/ErrorContext';

class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to our error service
    if (this.props.captureError) {
      this.props.captureError(error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We're sorry, but there was an error loading this page.
              </p>
            </div>
            
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {this.state.error && this.state.error.toString()}
                  </h3>
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-sm text-red-700">
                      <pre className="whitespace-pre-wrap">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Home Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component that uses the ErrorContext
const ErrorBoundary = ({ children }) => {
  const { captureError } = useError();
  
  return (
    <ErrorBoundaryFallback captureError={captureError}>
      {children}
    </ErrorBoundaryFallback>
  );
};

export default ErrorBoundary;
