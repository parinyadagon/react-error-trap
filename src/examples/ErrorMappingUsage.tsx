import { ErrorBoundary } from "@parinyadagon/react-error-trap";
import { useState } from "react";

// Custom Error class to simulate API errors with codes
class ApiError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

const BuggyComponent = ({ shouldThrow, errorCode }: { shouldThrow: boolean; errorCode?: string }) => {
  if (shouldThrow) {
    if (errorCode) {
      throw new ApiError("Something went wrong", errorCode);
    }
    throw new Error("Standard Error");
  }
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
      <p>Component is working correctly.</p>
    </div>
  );
};

export const ErrorMappingUsage = () => {
  const [errorState, setErrorState] = useState<{ shouldThrow: boolean; code?: string }>({
    shouldThrow: false,
  });

  const handleReset = () => {
    setErrorState({ shouldThrow: false });
  };

  const triggerAuthError = () => {
    setErrorState({ shouldThrow: true, code: "AUTH_WRONG_PASSWORD" });
  };

  const triggerPaymentError = () => {
    setErrorState({ shouldThrow: true, code: "PAYMENT_FAILED" });
  };

  const triggerUnknownError = () => {
    setErrorState({ shouldThrow: true, code: "UNKNOWN_CODE" });
  };

  return (
    <div className="card">
      <h3>Auto Error Mapping</h3>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        This example demonstrates how to map specific error codes to user-friendly messages automatically.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button
          onClick={triggerAuthError}
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}>
          Trigger Auth Error
        </button>
        <button
          onClick={triggerPaymentError}
          style={{
            backgroundColor: "#ffedd5",
            color: "#c2410c",
          }}>
          Trigger Payment Error
        </button>
        <button
          onClick={triggerUnknownError}
          style={{
            backgroundColor: "#f3f4f6",
            color: "#374151",
          }}>
          Trigger Unknown Code
        </button>
      </div>

      <div
        style={{
          border: "2px dashed #e5e7eb",
          borderRadius: "12px",
          padding: "2rem",
          backgroundColor: "#f9fafb",
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div style={{ width: "100%" }}>
          <ErrorBoundary
            onReset={handleReset}
            mode="inline"
            errorMessages={{
              AUTH_WRONG_PASSWORD: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง (Wrong Password)",
              PAYMENT_FAILED: "การชำระเงินล้มเหลว กรุณาตรวจสอบวงเงินบัตรเครดิต (Payment Failed)",
            }}>
            <BuggyComponent shouldThrow={errorState.shouldThrow} errorCode={errorState.code} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
