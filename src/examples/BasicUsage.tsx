import { useState } from "react";
import { ErrorBoundary, useErrorBoundary } from "@parinyadagon/react-error-trap";
import { BuggyComponent } from "./components";

const SoftErrorTrigger = () => {
  const { showBoundary } = useErrorBoundary();
  return (
    <button
      onClick={() => showBoundary(new Error("This is a soft error! UI remains active."))}
      style={{ marginTop: "10px", marginLeft: "10px", backgroundColor: "#10b981", color: "white", border: "none" }}>
      🔔 Trigger Soft Error
    </button>
  );
};

export const BasicUsage = () => {
  const [explode, setExplode] = useState(false);
  const [mode, setMode] = useState<"full-page" | "inline" | "toast" | "popup">("inline");

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>1. Basic Usage & Modes</h2>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>Select Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as "full-page" | "inline" | "toast" | "popup")} style={{ padding: "5px" }}>
          <option value="inline">Inline</option>
          <option value="toast">Toast</option>
          <option value="popup">Popup</option>
          <option value="full-page">Full Page</option>
        </select>
      </div>

      <div style={{ border: "1px dashed #ccc", padding: "20px", minHeight: "150px" }}>
        <ErrorBoundary
          mode={mode}
          onReset={() => setExplode(false)}
          fallbackRender={mode === "inline" ? undefined : undefined} // Use default for demo
        >
          <BuggyComponent shouldThrow={explode} />
          <div style={{ marginTop: "10px" }}>
            {!explode && <button onClick={() => setExplode(true)}>💣 Throw Render Error (Crashes UI)</button>}
            <SoftErrorTrigger />
          </div>
        </ErrorBoundary>
      </div>
      <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
        * <strong>Render Error:</strong> Unmounts the component tree (Standard React behavior). <br />* <strong>Soft Error:</strong> Uses{" "}
        <code>useErrorBoundary()</code> to show Toast/Popup without unmounting (Play on).
      </p>
    </section>
  );
};
