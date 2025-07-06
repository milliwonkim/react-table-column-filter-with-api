import axios from "axios";
import { getCookie } from "./cookies";
import { config } from "../config";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = getCookie(config.token.name);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      // 쿠키에서 토큰 삭제
      document.cookie = `${config.token.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // 로그인 페이지로 리다이렉트
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
