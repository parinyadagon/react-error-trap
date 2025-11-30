import { useErrorBoundaryConfig } from "@parinyadagon/react-error-trap";

const ConfigConsumer = () => {
  const config = useErrorBoundaryConfig();
  return (
    <div className="card">
      <h3>Current Config (from Context)</h3>
      <pre style={{ textAlign: "left", fontSize: "12px" }}>
        {JSON.stringify(config, (_key, value) => (typeof value === "function" ? "[Function]" : value), 2)}
      </pre>
    </div>
  );
};

export const ConfigConsumerUsage = () => {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>Config Debugger</h2>
      <ConfigConsumer />
    </section>
  );
};
