# 직원 관리 시스템 - 프론트엔드

React, TypeScript, Vite를 사용한 직원 관리 시스템의 프론트엔드 애플리케이션입니다.

## 주요 기능

- 🔐 **쿠키 기반 인증**: JWT 토큰을 쿠키에 안전하게 저장
- 📊 **필터링 가능한 테이블**: 실시간 필터링 및 정렬 기능
- 🎯 **반응형 디자인**: 다양한 화면 크기에 최적화
- ⚡ **성능 최적화**: React Query를 통한 효율적인 데이터 관리

## 인증 시스템

### 쿠키 기반 토큰 관리

이 애플리케이션은 보안을 위해 JWT 토큰을 쿠키에 저장합니다:

- **보안 쿠키**: `secure=true`, `sameSite=Strict` 설정
- **자동 만료**: 설정 가능한 만료 기간 (기본 7일)
- **자동 토큰 첨부**: 모든 API 요청에 자동으로 토큰 포함
- **자동 로그아웃**: 토큰 만료 시 자동으로 로그인 페이지로 리다이렉트

### 설정

`src/config/index.ts`에서 다음 설정을 변경할 수 있습니다:

```typescript
export const config = {
  api: {
    baseURL: "http://localhost:3000",
    timeout: 10000,
  },
  cookie: {
    secure: true, // HTTPS에서만 쿠키 전송
    sameSite: "Strict", // CSRF 공격 방지
    expiresDays: 7, // 쿠키 만료 기간
  },
  token: {
    name: "access_token", // 쿠키 이름
  },
};
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 기술 스택

- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 환경
- **React Query**: 서버 상태 관리
- **Axios**: HTTP 클라이언트
- **Floating UI**: 접근성 있는 드롭다운 컴포넌트

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── CustomSelect.tsx # 커스텀 셀렉트 컴포넌트
│   └── FilterableTable.tsx # 필터링 가능한 테이블
├── pages/              # 페이지 컴포넌트
│   ├── TablePage.tsx   # 메인 테이블 페이지
│   └── tableColumnInfo.tsx # 테이블 컬럼 설정
├── types/              # TypeScript 타입 정의
│   └── table.ts        # 테이블 관련 타입
├── utils/              # 유틸리티 함수
│   ├── axios.ts        # Axios 설정 및 인터셉터
│   └── cookies.ts      # 쿠키 관리 함수
├── config/             # 애플리케이션 설정
│   └── index.ts        # 설정 파일
└── App.tsx             # 메인 앱 컴포넌트
```

## API 통신

### Axios 인터셉터

모든 API 요청은 자동으로 다음 처리를 받습니다:

1. **요청 인터셉터**: 쿠키에서 토큰을 가져와 Authorization 헤더에 추가
2. **응답 인터셉터**: 401 에러 시 자동으로 쿠키 삭제 및 로그인 페이지 리다이렉트

### 사용 예시

```typescript
import apiClient from "./utils/axios";

// 토큰이 자동으로 포함됨
const response = await apiClient.get("/tasks/table-data");
```

## 보안 고려사항

1. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
2. **쿠키 보안**: `secure` 및 `sameSite` 설정으로 XSS/CSRF 공격 방지
3. **토큰 만료**: 적절한 만료 기간 설정
4. **자동 로그아웃**: 토큰 만료 시 자동 처리

## 개발 가이드

### 새로운 API 엔드포인트 추가

```typescript
// apiClient를 사용하여 자동 토큰 첨부
const response = await apiClient.post("/api/endpoint", data);
```

### 쿠키 관리

```typescript
import { setCookie, getCookie, deleteCookie } from "./utils/cookies";

// 쿠키 설정
setCookie("key", "value", { expires: 7 });

// 쿠키 읽기
const value = getCookie("key");

// 쿠키 삭제
deleteCookie("key");
```
