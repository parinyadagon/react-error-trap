import { ErrorBoundary } from "@parinyadagon/react-error-trap";
import { useState } from "react";

const Widget = ({ title }: { title: string }) => {
  const [crashed, setCrashed] = useState(false);

  if (crashed) {
    throw new Error(`Error in ${title}`);
  }

  return (
    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <h3>{title}</h3>
      <p>
        Status: <span style={{ color: "green" }}>Active</span>
      </p>
      <button onClick={() => setCrashed(true)}>Crash {title}</button>
    </div>
  );
};

export const MultipleSectionsUsage = () => {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>6. Multiple Independent Sections (Dashboard Pattern)</h2>
      <p>
        Even with a single global <code>ErrorBoundaryProvider</code>, you can wrap individual sections with <code>ErrorBoundary</code> to isolate
        failures. If one widget crashes, the others remain active.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}>
        {/* Widget 1 */}
        <div style={{ minHeight: "200px" }}>
          <ErrorBoundary mode="inline">
            <Widget title="User Stats" />
          </ErrorBoundary>
        </div>

        {/* Widget 2 */}
        <div style={{ minHeight: "200px" }}>
          <ErrorBoundary mode="inline">
            <Widget title="Recent Activity" />
          </ErrorBoundary>
        </div>

        {/* Widget 3 */}
        <div style={{ minHeight: "200px" }}>
          <ErrorBoundary mode="inline">
            <Widget title="System Status" />
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
};
