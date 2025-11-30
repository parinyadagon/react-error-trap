import type { ReactNode, CSSProperties } from "react";

export type ErrorDisplayMode = "inline" | "full-page" | "toast" | "popup";

export interface CustomStyles {
  container?: CSSProperties;
  button?: CSSProperties;
  message?: CSSProperties;
  icon?: CSSProperties;
}

export interface FallbackProps {
  error: Error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetErrorBoundary: (...args: any[]) => void;
  mode?: ErrorDisplayMode;
  customStyles?: CustomStyles;
  className?: string;
  errorMessages?: Partial<ErrorMessageMap>;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | React.ComponentType<FallbackProps>;
  FallbackComponent?: React.ComponentType<FallbackProps>; // Alias for fallback as component
  fallbackRender?: (props: FallbackProps) => ReactNode; // Alias for fallback as render prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReset?: (details: { reason: "imperative-api"; args: any[] } | { reason: "keys"; prev: any[]; next: any[] }) => void;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetKeys?: any[];
  mode?: ErrorDisplayMode;
  customStyles?: CustomStyles;
  className?: string;
  errorMessages?: Partial<ErrorMessageMap>;
  fallbacks?: Partial<Record<ErrorDisplayMode, React.ComponentType<FallbackProps>>>;
  onShowToast?: (message: string, error: Error, reset: () => void) => void;
  onShowPopup?: (message: string, error: Error, reset: () => void) => void;
}

export interface ErrorMessageMap {
  [key: string]: string;
  default: string;
  network: string;
}

export interface ErrorBoundaryConfig {
  fallback?: ReactNode | React.ComponentType<FallbackProps>;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  mode?: ErrorDisplayMode;
  customStyles?: CustomStyles;
  className?: string;
  errorMessages?: Partial<ErrorMessageMap>;
  fallbacks?: Partial<Record<ErrorDisplayMode, React.ComponentType<FallbackProps>>>;
  onShowToast?: (message: string, error: Error, reset: () => void) => void;
  onShowPopup?: (message: string, error: Error, reset: () => void) => void;
}
