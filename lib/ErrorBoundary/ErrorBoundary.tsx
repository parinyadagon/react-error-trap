import React, { Component } from "react";
import type { ErrorInfo } from "react";
import type { ErrorBoundaryProps, FallbackProps } from "../types";
import { ErrorFallback } from "../components/ErrorFallback";
import { useErrorBoundaryConfig } from "../context/shared";
import { getErrorMessage } from "../utils/errorMapping";

interface State {
  hasError: boolean;
  error: Error | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changedArray = (a: any[] = [], b: any[] = []) => a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  componentDidMount() {
    const { hasError, error } = this.state;
    const { mode, onShowToast, onShowPopup, errorMessages } = this.props;

    if (hasError && error) {
      const message = getErrorMessage(error, errorMessages);
      if (mode === "toast" && onShowToast) {
        onShowToast(message, error, this.resetErrorBoundary);
      } else if (mode === "popup" && onShowPopup) {
        onShowPopup(message, error, this.resetErrorBoundary);
      }
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: State) {
    const { hasError, error } = this.state;
    const { resetKeys, mode, onShowToast, onShowPopup, errorMessages } = this.props;

    // Handle External Toast/Popup Triggers
    if (hasError && !prevState.hasError && error) {
      const message = getErrorMessage(error, errorMessages);
      if (mode === "toast" && onShowToast) {
        onShowToast(message, error, this.resetErrorBoundary);
      } else if (mode === "popup" && onShowPopup) {
        onShowPopup(message, error, this.resetErrorBoundary);
      }
    }

    // Check if resetKeys have changed
    if (hasError && resetKeys && prevProps.resetKeys && changedArray(prevProps.resetKeys, resetKeys)) {
      this.resetErrorBoundary({ reason: "keys", prev: prevProps.resetKeys, next: resetKeys });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetErrorBoundary = (...args: any[]) => {
    if (this.props.onReset) {
      this.props.onReset(args[0] || { reason: "imperative-api", args });
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const fallbackProps: FallbackProps = {
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary,
        mode: this.props.mode || "full-page",
        customStyles: this.props.customStyles,
        className: this.props.className,
        errorMessages: this.props.errorMessages,
      };

      if (React.isValidElement(this.props.fallback)) {
        return this.props.fallback;
      }

      if (this.props.fallbackRender) {
        return this.props.fallbackRender(fallbackProps);
      }

      if (this.props.FallbackComponent) {
        const FallbackComponent = this.props.FallbackComponent;
        return <FallbackComponent {...fallbackProps} />;
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback as React.ComponentType<FallbackProps>;
        return <FallbackComponent {...fallbackProps} />;
      }

      // Check for mode-specific fallback
      if (this.props.fallbacks && fallbackProps.mode && this.props.fallbacks[fallbackProps.mode]) {
        const ModeFallback = this.props.fallbacks[fallbackProps.mode];
        if (ModeFallback) {
          return <ModeFallback {...fallbackProps} />;
        }
      }

      // If using external toast/popup handlers, we might want to render nothing (or a minimal placeholder)
      // instead of the default UI, to avoid duplication.
      if (fallbackProps.mode === "toast" && this.props.onShowToast) {
        return null;
      }
      if (fallbackProps.mode === "popup" && this.props.onShowPopup) {
        return null;
      }

      return <ErrorFallback {...fallbackProps} />;
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  // Pass local props to the hook to get the final merged configuration
  // We only include defined props to avoid overwriting global config with undefined
  const overrides: Partial<ErrorBoundaryProps> = {};
  if (props.mode) overrides.mode = props.mode;
  if (props.customStyles) overrides.customStyles = props.customStyles;
  if (props.className) overrides.className = props.className;
  if (props.fallback) overrides.fallback = props.fallback;
  if (props.errorMessages) overrides.errorMessages = props.errorMessages;
  if (props.fallbacks) overrides.fallbacks = props.fallbacks;
  if (props.onShowToast) overrides.onShowToast = props.onShowToast;
  if (props.onShowPopup) overrides.onShowPopup = props.onShowPopup;

  const config = useErrorBoundaryConfig(overrides);

  // We still need the raw global config to chain the onError handler
  const globalConfig = useErrorBoundaryConfig();

  const mergedProps: ErrorBoundaryProps = {
    ...props,
    mode: config.mode, // Config has the merged mode (prop > global)
    customStyles: config.customStyles, // Config has the merged styles
    className: config.className,
    fallback: config.fallback,
    errorMessages: config.errorMessages,
    fallbacks: config.fallbacks,
    onShowToast: config.onShowToast,
    onShowPopup: config.onShowPopup,
    onError: (error, info) => {
      if (props.onError) props.onError(error, info);
      if (globalConfig.onError) globalConfig.onError(error, info);
    },
  };

  return <ErrorBoundaryInner {...mergedProps} />;
};
