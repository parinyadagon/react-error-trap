import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorBoundaryProvider } from "../context/ErrorBoundaryContext";
import React from "react";

const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders default fallback when an error occurs", () => {
    // Prevent console.error from cluttering the test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // The default error message logic returns error.message for standard Errors
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("calls onError when an error occurs", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("resets error boundary when Try Again is clicked", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onReset = vi.fn();

    // We need a component that can toggle the error state to test reset
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <ErrorBoundary
          onReset={() => {
            setShouldThrow(false);
            onReset();
          }}>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText("Test error")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(onReset).toHaveBeenCalled();
    expect(screen.getByText("No error")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("resets when resetKeys change", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const TestComponent = () => {
      const [key, setKey] = React.useState(0);
      return (
        <div>
          <button onClick={() => setKey((k) => k + 1)}>Change Key</button>
          <ErrorBoundary resetKeys={[key]} fallback={<div>Error</div>}>
            <ThrowError shouldThrow={key === 0} />
          </ErrorBoundary>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByText("Error")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Change Key"));
    expect(screen.getByText("No error")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("calls onShowToast when mode is toast", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onShowToast = vi.fn();

    render(
      <ErrorBoundary mode="toast" onShowToast={onShowToast}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onShowToast).toHaveBeenCalled();
    expect(screen.queryByText("Test error")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders fallbackRender prop", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary fallbackRender={({ error }) => <div>Render Prop: {error.message}</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Render Prop: Test error")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("renders FallbackComponent prop", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Fallback = ({ error }: { error: Error }) => <div>Component: {error.message}</div>;
    render(
      <ErrorBoundary FallbackComponent={Fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Component: Test error")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("renders mode-specific fallback", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary mode="inline" fallbacks={{ inline: ({ error }) => <div>Inline: {error.message}</div> }}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Inline: Test error")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("calls global onError from context", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const globalOnError = vi.fn();

    render(
      <ErrorBoundaryProvider config={{ onError: globalOnError }}>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundaryProvider>
    );

    expect(globalOnError).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("calls onShowPopup when mode is popup", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onShowPopup = vi.fn();

    render(
      <ErrorBoundary mode="popup" onShowPopup={onShowPopup}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onShowPopup).toHaveBeenCalled();
    expect(screen.queryByText("Test error")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders fallback prop as a Component", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Fallback = ({ error }: { error: Error }) => <div>Fallback Prop Component: {error.message}</div>;

    render(
      <ErrorBoundary fallback={Fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Fallback Prop Component: Test error")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("calls onReset with arguments when resetErrorBoundary is called", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onReset = vi.fn();

    render(
      <ErrorBoundary
        onReset={onReset}
        fallbackRender={({ resetErrorBoundary }) => <button onClick={() => resetErrorBoundary("custom-arg")}>Reset</button>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText("Reset"));
    expect(onReset).toHaveBeenCalledWith("custom-arg");
    consoleSpy.mockRestore();
  });

  it("triggers popup logic in componentDidMount if error exists on mount", () => {
    // This is tricky to test because ErrorBoundary usually catches errors from children during render/lifecycle
    // and updates state. To test componentDidMount having an error, we'd need to hydrate state or similar.
    // However, standard ErrorBoundary flow is: render -> error -> getDerivedStateFromError -> render (with error) -> componentDidMount (of ErrorBoundary? No, it's already mounted).
    // Actually, componentDidMount runs only once. If an error happens in a child's componentDidMount, the boundary catches it.
    // But the boundary itself is already mounted.
    // The only way `componentDidMount` of ErrorBoundary sees `hasError: true` is if the state was initialized with error?
    // Or if we are using some server-side rendering hydration mismatch?
    // Wait, `getDerivedStateFromError` is static.
    // If a child throws during its constructor or render, `getDerivedStateFromError` is called.
    // Then `ErrorBoundary` re-renders with `hasError: true`.
    // Does `componentDidMount` run then?
    // If the error happens during the *initial* render of the tree, `ErrorBoundary` mounts.
    // If the child throws during *its* mount, `ErrorBoundary` catches it.
    // Let's try to throw in a child's render immediately.

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onShowPopup = vi.fn();

    // We need a fresh component to ensure mount
    const ThrowOnRender = () => {
      throw new Error("Mount error");
    };

    render(
      <ErrorBoundary mode="popup" onShowPopup={onShowPopup}>
        <ThrowOnRender />
      </ErrorBoundary>
    );

    // In React 18+, strict mode might cause double invoke, but let's see.
    // If the error is caught during initial render, the boundary renders the fallback (or null for popup).
    // Then componentDidMount should run?
    // Actually, if an error occurs during render, React unmounts the partial tree and tries to render the fallback.
    // So ErrorBoundary *completes* its mount with the fallback.
    // So `componentDidMount` should see the error state.

    expect(onShowPopup).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
