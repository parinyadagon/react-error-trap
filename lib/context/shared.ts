import { createContext, useContext } from "react";
import type { ErrorBoundaryConfig, ErrorDisplayMode } from "../types";

export const ErrorBoundaryContext = createContext<ErrorBoundaryConfig>({});

export const useErrorBoundaryConfig = (overrides?: ErrorBoundaryConfig | ErrorDisplayMode): ErrorBoundaryConfig => {
  const globalConfig = useContext(ErrorBoundaryContext);

  if (typeof overrides === "string") {
    return { ...globalConfig, mode: overrides };
  }

  // Merge overrides, ignoring undefined values
  const merged = { ...globalConfig };
  if (overrides) {
    (Object.keys(overrides) as (keyof ErrorBoundaryConfig)[]).forEach((key) => {
      if (overrides[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (merged as any)[key] = overrides[key];
      }
    });
  }

  return merged;
};
