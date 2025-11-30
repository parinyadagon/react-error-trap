import React from "react";
import type { FallbackProps } from "../types";
import { getErrorMessage } from "../utils/errorMapping";

export const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary, mode = "full-page", customStyles, className, errorMessages }) => {
  const message = getErrorMessage(error, errorMessages);
  const isDev = process.env.NODE_ENV === "development";

  const isToast = mode === "toast";
  const isPopup = mode === "popup";
  const isFullPage = mode === "full-page";

  // Modern Minimalist Theme (inspired by Vercel/Geist)
  const theme = {
    bg: isToast ? "#18181B" : "#FFFFFF",
    text: isToast ? "#FAFAFA" : "#09090B",
    subtext: isToast ? "#A1A1AA" : "#71717A",
    border: isToast ? "1px solid #27272A" : "1px solid #E4E4E7",
    shadow: isToast
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    iconColor: "#EF4444", // Red 500
    button: {
      bg: isToast ? "#FAFAFA" : "#18181B",
      text: isToast ? "#18181B" : "#FAFAFA",
      hover: isToast ? "#E4E4E7" : "#27272A",
    },
  };

  const containerStyles: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: theme.bg,
    color: theme.text,
    border: isFullPage ? "none" : theme.border,
    borderRadius: isFullPage ? "0" : "12px",
    boxShadow: isFullPage ? "none" : theme.shadow,
    padding: isToast ? "16px" : "32px",
    display: "flex",
    flexDirection: isToast ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    gap: isToast ? "16px" : "24px",
    maxWidth: isToast ? "400px" : isPopup ? "420px" : "100%",
    width: isFullPage ? "100%" : "auto",
    minHeight: isFullPage ? "100vh" : "auto",
    position: isToast ? "fixed" : "relative",
    bottom: isToast ? "24px" : "auto",
    right: isToast ? "24px" : "auto",
    zIndex: isToast ? 9999 : "auto",
    boxSizing: "border-box",
    textAlign: isToast ? "left" : "center",
    ...customStyles?.container,
  };

  const buttonStyles: React.CSSProperties = {
    appearance: "none",
    backgroundColor: theme.button.bg,
    color: theme.button.text,
    border: "none",
    borderRadius: "6px",
    padding: isToast ? "8px 12px" : "10px 24px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    ...customStyles?.button,
  };

  const iconSvg = (
    <svg
      className="reb-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: isToast ? "20px" : "48px",
        height: isToast ? "20px" : "48px",
        flexShrink: 0,
        ...customStyles?.icon,
      }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const content = (
    <div style={containerStyles} className={`reb-container ${className || ""}`}>
      <style>
        {`
          @keyframes reb-fade-in-up {
            0% { opacity: 0; transform: translateY(12px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          .reb-container {
            animation: reb-fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .reb-button {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .reb-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            filter: brightness(1.05);
          }

          .reb-button:active {
            transform: translateY(0) scale(0.96);
            filter: brightness(0.95);
          }
        `}
      </style>

      {iconSvg}

      <div style={{ flex: 1 }} className="reb-content">
        <h3
          style={{
            margin: "0 0 4px 0",
            fontSize: isToast ? "14px" : "18px",
            fontWeight: 600,
            lineHeight: 1.4,
            ...customStyles?.message,
          }}>
          {message}
        </h3>
        {!isToast && (
          <p style={{ margin: 0, fontSize: "14px", color: theme.subtext, lineHeight: 1.5 }}>
            Please try again or contact support if the problem persists.
          </p>
        )}
      </div>

      <button onClick={resetErrorBoundary} style={buttonStyles} className="reb-button">
        Try Again
      </button>

      {isDev && !isToast && (
        <div style={{ width: "100%", marginTop: "16px", textAlign: "left" }}>
          <details
            style={{
              border: theme.border,
              borderRadius: "6px",
              backgroundColor: isFullPage ? "#F4F4F5" : "transparent",
              overflow: "hidden",
            }}>
            <summary
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                color: theme.subtext,
                userSelect: "none",
                listStyle: "none",
              }}>
              Show Error Details
            </summary>
            <pre
              style={{
                margin: 0,
                padding: "12px",
                fontSize: "11px",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                overflowX: "auto",
                color: "#EF4444",
                borderTop: theme.border,
                backgroundColor: "#FEF2F2",
              }}>
              {error.stack || error.message}
            </pre>
          </details>
        </div>
      )}
    </div>
  );

  if (isPopup) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "reb-fade-in 0.2s ease-out",
        }}>
        {content}
      </div>
    );
  }

  return content;
};
