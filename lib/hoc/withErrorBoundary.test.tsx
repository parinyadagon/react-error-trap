import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { withErrorBoundary } from "./withErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("withErrorBoundary", () => {
  it("renders the wrapped component", () => {
    const WrappedComponent = withErrorBoundary(ThrowError, {});
    render(<WrappedComponent />);
    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("catches errors from the wrapped component", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const WrappedComponent = withErrorBoundary(ThrowError, {
      fallback: <div>Caught by HOC</div>,
    });

    render(<WrappedComponent shouldThrow={true} />);
    expect(screen.getByText("Caught by HOC")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
