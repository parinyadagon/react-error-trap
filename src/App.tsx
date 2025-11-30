import { useState } from "react";
import { ErrorBoundaryProvider } from "@parinyadagon/react-error-trap";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { BasicUsage } from "./examples/BasicUsage";
import { HookUsage } from "./examples/HookUsage";
import { HOCUsage } from "./examples/HOCUsage";
import { ResetKeysUsage } from "./examples/ResetKeysUsage";
import { CustomFallbackUsage } from "./examples/CustomFallbackUsage";
import { ConfigConsumerUsage } from "./examples/ConfigConsumerUsage";
import { MultipleSectionsUsage } from "./examples/MultipleSectionsUsage";
import { ErrorMappingUsage } from "./examples/ErrorMappingUsage";

const TABS = [
  { id: "basic", label: "Basic Usage", component: BasicUsage },
  { id: "mapping", label: "Error Mapping", component: ErrorMappingUsage },
  { id: "hooks", label: "Hooks", component: HookUsage },
  { id: "hoc", label: "HOC", component: HOCUsage },
  { id: "reset", label: "Reset Keys", component: ResetKeysUsage },
  { id: "fallback", label: "Custom Fallback", component: CustomFallbackUsage },
  { id: "multiple", label: "Multiple Sections", component: MultipleSectionsUsage },
  { id: "config", label: "Config Debugger", component: ConfigConsumerUsage },
];

function App() {
  const [activeTab, setActiveTab] = useState("basic");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component || BasicUsage;

  return (
    <ErrorBoundaryProvider
      config={{
        onError: (error) => console.error("Global Logging:", error),
        mode: "toast", // Default global mode
        errorMessages: {
          401: "Session หมดอายุ (Global Config)",
          500: "เซิร์ฟเวอร์มีปัญหา (Global Config)",
        },
        // Example: Hooking into an external toast library (simulated here)
        onShowToast: (message, _error, reset) => {
          toast.error(
            (t) => (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{message}</span>
                <button
                  onClick={() => {
                    reset();
                    toast.dismiss(t.id);
                  }}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>
                  Retry
                </button>
              </div>
            ),
            { duration: 5000 }
          );
        },
        /*  fallbacks: {
          inline: ({ error, resetErrorBoundary }) => (
            <div style={{ padding: "10px", border: "1px solid red", color: "red" }}>
              <strong>Inline Error (Global):</strong> {error.message}
              <button onClick={resetErrorBoundary} style={{ marginLeft: "10px" }}>
                Retry
              </button>
            </div>
          ),
        }, */
      }}>
      <div>
        <Toaster position="bottom-right" />
        <h1>React Error Trap Library Demo</h1>

        <div className="tabs">
          {TABS.map((tab) => (
            <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="example-container">
          <ActiveComponent />
        </div>
      </div>
    </ErrorBoundaryProvider>
  );
}

export default App;
