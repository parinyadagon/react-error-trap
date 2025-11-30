import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useErrorBoundaryConfig, ErrorBoundaryContext } from "./shared";
import React from "react";

describe("useErrorBoundaryConfig", () => {
  it("returns empty config by default", () => {
    const { result } = renderHook(() => useErrorBoundaryConfig());
    expect(result.current).toEqual({});
  });

  it("merges global config with overrides", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorBoundaryContext.Provider value={{ mode: "toast" }}>{children}</ErrorBoundaryContext.Provider>
    );

    const { result } = renderHook(() => useErrorBoundaryConfig({ mode: "popup" }), { wrapper });
    expect(result.current.mode).toBe("popup");
  });

  it("respects global config if no override", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorBoundaryContext.Provider value={{ mode: "toast" }}>{children}</ErrorBoundaryContext.Provider>
    );

    const { result } = renderHook(() => useErrorBoundaryConfig(), { wrapper });
    expect(result.current.mode).toBe("toast");
  });

  it("handles string override as mode", () => {
    const { result } = renderHook(() => useErrorBoundaryConfig("inline"));
    expect(result.current.mode).toBe("inline");
  });
});
