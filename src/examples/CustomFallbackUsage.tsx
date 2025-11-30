import { ErrorBoundary } from "@parinyadagon/react-error-trap";
import type { FallbackProps } from "@parinyadagon/react-error-trap";
import { BuggyComponent } from "./components";

const CustomFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div role="alert" style={{ padding: "20px", background: "#ffebee", color: "#c62828" }}>
    <h2>Something went wrong (Custom Fallback)</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export const CustomFallbackUsage = () => {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>5. Custom Fallback Component</h2>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    </section>
  );
};
