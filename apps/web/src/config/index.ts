// 애플리케이션 설정
export const config = {
  // API 설정
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    timeout: 10000,
  },

  // 쿠키 설정
  cookie: {
    // 개발 환경에서는 secure를 false로 설정 (HTTP 사용 시)
    secure: import.meta.env.DEV
      ? false
      : import.meta.env.VITE_COOKIE_SECURE === "true" || true,
    sameSite:
      (import.meta.env.VITE_COOKIE_SAME_SITE as "Strict" | "Lax" | "None") ||
      "Strict",
    expiresDays: parseInt(import.meta.env.VITE_COOKIE_EXPIRES_DAYS || "7"),
  },

  // 토큰 설정
  token: {
    name: "access_token",
  },

  // 환경 설정
  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
} as const;
