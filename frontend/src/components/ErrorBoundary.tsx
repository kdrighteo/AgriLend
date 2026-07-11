import React, { Component, ErrorInfo, ReactNode } from "react";
import "../styles/ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            <details className="error-details">
              <summary>Show error details</summary>
              <pre className="error-stack">
                <p>{this.state.error?.message}</p>
                <p>{this.state.error?.stack}</p>
              </pre>
            </details>
            <button
              className="error-button"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <button
              className="error-button secondary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
