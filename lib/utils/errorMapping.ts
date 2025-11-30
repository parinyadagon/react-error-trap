import type { ErrorMessageMap } from "../types";

const defaultErrorMessages: ErrorMessageMap = {
  401: "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่",
  500: "เซิร์ฟเวอร์มีปัญหา กรุณาติดต่อผู้ดูแลระบบ",
  default: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
  network: "ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้",
};

export const getErrorMessage = (error: unknown, customMapping?: Partial<ErrorMessageMap>): string => {
  const messages = { ...defaultErrorMessages, ...customMapping };

  if (!error) return messages.default;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyError = error as any;

  // 1. Check for specific error code (e.g. "AUTH_WRONG_PASSWORD")
  if (anyError.code && messages[anyError.code]) {
    return messages[anyError.code] as string;
  }

  // 2. Check for Axios-like response status
  if (anyError.response?.status && messages[anyError.response.status]) {
    return messages[anyError.response.status] as string;
  }

  // 3. Check for "Network Error"
  if (anyError.message === "Network Error") {
    return messages.network;
  }

  // 4. Fallback to error message if it's a standard Error
  if (error instanceof Error) {
    return error.message || messages.default;
  }

  return messages.default;
};
