import { useState, useEffect } from "react";
import { useErrorBoundary, ErrorBoundary } from "@parinyadagon/react-error-trap";

const AsyncHandlerDemo = () => {
  const { showBoundary } = useErrorBoundary();

  const handleAsyncError = async () => {
    try {
      // Simulate async operation
      await new Promise((_, reject) => setTimeout(() => reject(new Error("Async Error caught by useErrorBoundary!")), 500));
    } catch (error) {
      showBoundary(error as Error);
    }
  };

  return (
    <div className="card">
      <h3>Async Event Handler</h3>
      <p>Click to trigger an async error caught by the boundary.</p>
      <button onClick={handleAsyncError}>Trigger Async Error</button>
    </div>
  );
};

const UseEffectDemo = () => {
  const { showBoundary } = useErrorBoundary();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;

    // Simulate fetch API call
    const fakeFetch = () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Error from useEffect fetch!")), 1000);
      });

    fakeFetch().then(
      () => {
        setIsLoading(false);
        setShouldFetch(false);
      },
      (error) => {
        setIsLoading(false);
        setShouldFetch(false);
        showBoundary(error);
      }
    );
  }, [shouldFetch, showBoundary]);

  return (
    <div className="card">
      <h3>useEffect Fetch Demo</h3>
      <p>Click to simulate a fetch error inside useEffect.</p>
      <button onClick={() => setShouldFetch(true)} disabled={isLoading}>
        {isLoading ? "Loading..." : "Start Fetch"}
      </button>
    </div>
  );
};

export const HookUsage = () => {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>2. useErrorBoundary Hook</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <ErrorBoundary mode="popup">
          <AsyncHandlerDemo />
        </ErrorBoundary>

        <ErrorBoundary mode="popup">
          <UseEffectDemo />
        </ErrorBoundary>
      </div>
    </section>
  );
};
