import React, { useState, useEffect } from "react";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TablePage from "./pages/TablePage";
import { setCookie, getCookie, deleteCookie } from "./utils/cookies";
import apiClient from "./utils/axios";
import { config } from "./config";

interface LoginForm {
  username: string;
  password: string;
}

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지 로드 시 토큰 확인
  useEffect(() => {
    const savedToken = getCookie(config.token.name);
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<{ access_token: string }>(
        "/auth/login",
        form
      );
      setToken(res.data.access_token);
      setCookie(config.token.name, res.data.access_token, {
        expires: config.cookie.expiresDays,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
      });
      setIsLoggedIn(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "로그인 실패");
      } else {
        setError("알 수 없는 오류");
      }
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    deleteCookie(config.token.name);
    setToken(null);
    setIsLoggedIn(false);
    setForm({ username: "", password: "" });
  };

  // 로그인된 경우 테이블 페이지 표시
  if (isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #dee2e6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>직원 관리 시스템</h2>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          </div>
          <TablePage />
        </div>
      </QueryClientProvider>
    );
  }

  // 로그인되지 않은 경우 로그인 폼 표시
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="아이디"
            required
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
        {token && (
          <div style={{ color: "green", marginTop: 12 }}>
            로그인 성공! (JWT 저장됨)
          </div>
        )}
      </form>
    </div>
  );
};

export default App;
