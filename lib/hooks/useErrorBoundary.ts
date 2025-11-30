import { useState } from "react";

export interface UseErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

export interface UseErrorBoundaryApi<ErrorType extends Error = Error> {
  resetBoundary: () => void;
  showBoundary: (error: ErrorType) => void;
}

export function useErrorBoundary<ErrorType extends Error = Error>(): UseErrorBoundaryApi<ErrorType> {
  const [state, setState] = useState<UseErrorBoundaryState>({
    error: null,
    hasError: false,
  });

  if (state.hasError && state.error) {
    throw state.error;
  }

  const showBoundary = (error: ErrorType) => {
    setState({
      error,
      hasError: true,
    });
  };

  const resetBoundary = () => {
    setState({
      error: null,
      hasError: false,
    });
  };

  return {
    showBoundary,
    resetBoundary,
  };
}
