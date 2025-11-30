import { useState } from "react";
import { ErrorBoundary } from "@parinyadagon/react-error-trap";
import { BuggyComponent } from "./components";

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
          {!explode && (
            <button onClick={() => setExplode(true)} style={{ marginTop: "10px" }}>
              💣 Throw Error
            </button>
          )}
        </ErrorBoundary>
      </div>
    </section>
  );
};
