import { Component, ReactNode } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: () => ReactNode;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static LatestError?: Error = undefined;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    ErrorBoundary.LatestError = error;
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    ErrorBoundary.LatestError = error;
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError || ErrorBoundary.LatestError !== undefined) {
      return (
        <>
          <div>{this.props.fallback()}</div>
          <div>{this.props.children}</div>
        </>
      );
    }

    return this.props.children;
  }
}
