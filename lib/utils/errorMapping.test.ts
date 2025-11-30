import { describe, it, expect } from "vitest";
import { getErrorMessage } from "./errorMapping";

describe("getErrorMessage", () => {
  it("returns default message for null/undefined", () => {
    expect(getErrorMessage(null)).toBe("เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง");
    expect(getErrorMessage(undefined)).toBe("เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง");
  });

  it("returns network error message", () => {
    expect(getErrorMessage({ message: "Network Error" })).toBe("ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้");
  });

  it("returns message for specific status code (401)", () => {
    expect(getErrorMessage({ response: { status: 401 } })).toBe("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
  });

  it("returns message for specific status code (500)", () => {
    expect(getErrorMessage({ response: { status: 500 } })).toBe("เซิร์ฟเวอร์มีปัญหา กรุณาติดต่อผู้ดูแลระบบ");
  });

  it("returns error message for standard Error object", () => {
    expect(getErrorMessage(new Error("Something went wrong"))).toBe("Something went wrong");
  });

  it("uses custom mapping if provided", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customMap: any = { 418: "I'm a teapot" };
    expect(getErrorMessage({ response: { status: 418 } }, customMap)).toBe("I'm a teapot");
  });

  it("prioritizes custom mapping over default", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customMap: any = { 401: "Custom 401" };
    expect(getErrorMessage({ response: { status: 401 } }, customMap)).toBe("Custom 401");
  });

  it("returns message for specific error code", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = { code: "AUTH_ERROR" };
    const customMap = { AUTH_ERROR: "Authentication failed" };
    expect(getErrorMessage(error, customMap)).toBe("Authentication failed");
  });
});
