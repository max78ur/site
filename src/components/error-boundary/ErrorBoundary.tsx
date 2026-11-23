import React, { ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="premium-card p-8 bg-black/80 text-white rounded-3xl backdrop-blur-md">
          <h3 className="text-2xl font-bold mb-4">Technical Issue</h3>
          <p className="text-gray-400 leading-relaxed">
            Unable to load the 3D truck experience. <a href="/contact" className="text-primary-red hover:underline">Contact support</a> if the problem persists.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}