import React from "react";
import type { ReactNode } from "react";
import type { ErrorBoundaryConfig } from "../types";
import { ErrorBoundaryContext } from "./shared";

export const ErrorBoundaryProvider: React.FC<{ children: ReactNode; config: ErrorBoundaryConfig }> = ({ children, config }) => {
  return <ErrorBoundaryContext.Provider value={config}>{children}</ErrorBoundaryContext.Provider>;
};
