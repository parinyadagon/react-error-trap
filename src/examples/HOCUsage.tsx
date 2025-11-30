import { useState } from "react";
import { withErrorBoundary } from "@parinyadagon/react-error-trap";
import type { FallbackProps } from "@parinyadagon/react-error-trap";

const MyComponent = ({ title }: { title: string }) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(`Error from ${title}`);
  }

  return (
    <div className="card">
      <p>
        HOC Component: <strong>{title}</strong>
      </p>
      <button onClick={() => setShouldThrow(true)}>💣 Crash Me</button>
    </div>
  );
};

const MyComponentWithBoundary = withErrorBoundary(MyComponent, {
  mode: "inline",
  fallbackRender: ({ error, resetErrorBoundary }: FallbackProps) => (
    <div style={{ padding: "10px", border: "1px solid red", color: "red", borderRadius: "8px" }}>
      <p style={{ margin: "0 0 10px 0" }}>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  ),
});

export const HOCUsage = () => {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>3. withErrorBoundary HOC</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <MyComponentWithBoundary title="Component A" />
        <MyComponentWithBoundary title="Component B" />
      </div>
    </section>
  );
};
