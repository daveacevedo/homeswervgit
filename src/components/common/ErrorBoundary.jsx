import React from 'react';
import { logError } from '../../utils/errorHandling';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    logError(error, { 
      location: 'ErrorBoundary', 
      componentStack: errorInfo.componentStack 
    });
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            We've encountered an error and our team has been notified.
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-4 p-4 bg-gray-800 text-white rounded overflow-auto max-h-64">
              <p className="font-mono text-sm">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="mt-2 font-mono text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
