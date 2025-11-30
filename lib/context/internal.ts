import { createContext, useContext } from "react";
import type { ErrorDisplayMode } from "../types";

export interface ErrorBoundaryInternalContextType {
  mode: ErrorDisplayMode;
  hasToastHandler: boolean;
  hasPopupHandler: boolean;
  triggerError: (error: Error) => void;
}

export const ErrorBoundaryInternalContext = createContext<ErrorBoundaryInternalContextType | null>(null);

export const useErrorBoundaryInternal = () => useContext(ErrorBoundaryInternalContext);
