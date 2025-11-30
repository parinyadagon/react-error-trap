import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ErrorFallback } from "./ErrorFallback";

describe("ErrorFallback", () => {
  const mockReset = vi.fn();
  const mockError = new Error("Test Error Message");
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test"; // Default for tests
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("renders correctly in default mode (full-page)", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);

    expect(screen.getByText("Test Error Message")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText(/Please try again or contact support/)).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when Try Again is clicked", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);

    fireEvent.click(screen.getByText("Try Again"));
    expect(mockReset).toHaveBeenCalled();
  });

  it("renders in toast mode", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} mode="toast" />);

    expect(screen.getByText("Test Error Message")).toBeInTheDocument();
    // Toast usually doesn't show the "Please try again..." subtext
    expect(screen.queryByText(/Please try again or contact support/)).not.toBeInTheDocument();
  });

  it("renders in popup mode", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} mode="popup" />);

    expect(screen.getByText("Test Error Message")).toBeInTheDocument();
    // Popup should show the subtext
    expect(screen.getByText(/Please try again or contact support/)).toBeInTheDocument();
  });

  it("shows stack trace in development mode", () => {
    process.env.NODE_ENV = "development";

    const { container } = render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);

    expect(screen.getByText("Show Error Details")).toBeInTheDocument();

    // Check that the stack trace is rendered in a pre tag
    // The error message should appear in the header AND the stack trace
    const errorMessages = screen.getAllByText(/Test Error Message/);
    expect(errorMessages.length).toBeGreaterThanOrEqual(2);

    // Verify pre tag exists and contains error info
    const preTag = container.querySelector("pre");
    expect(preTag).toBeInTheDocument();
    expect(preTag).toHaveTextContent("Test Error Message");
  });

  it("hides stack trace in production mode", () => {
    process.env.NODE_ENV = "production";

    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);

    expect(screen.queryByText("Show Error Details")).not.toBeInTheDocument();
  });

  it("applies custom styles", () => {
    const customStyles = {
      container: { backgroundColor: "rgb(255, 0, 0)" },
      button: { color: "rgb(0, 0, 255)" },
      message: { fontSize: "20px" },
      icon: { width: "100px" },
    };

    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} customStyles={customStyles} />);

    const button = screen.getByText("Try Again");
    expect(button).toHaveStyle({ color: "rgb(0, 0, 255)" });

    const message = screen.getByText("Test Error Message");
    expect(message).toHaveStyle({ fontSize: "20px" });
  });
});
