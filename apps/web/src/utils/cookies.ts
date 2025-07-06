// 쿠키 관리 유틸리티 함수들

/**
 * 쿠키 설정
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param options 쿠키 옵션 (expires, path, domain, secure, sameSite)
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    expires?: number; // 일 단위
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void => {
  const {
    expires = 7, // 기본 7일
    path = "/",
    domain,
    secure = true,
    sameSite = "Strict",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * 쿠키 가져오기
 * @param name 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

/**
 * 쿠키 삭제
 * @param name 쿠키 이름
 * @param path 쿠키 경로 (설정할 때와 동일해야 함)
 */
export const deleteCookie = (name: string, path: string = "/"): void => {
  setCookie(name, "", { expires: -1, path });
};

/**
 * 모든 쿠키 가져오기
 * @returns 쿠키 객체
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;

  if (cookieString) {
    const cookiePairs = cookieString.split(";");
    cookiePairs.forEach((pair) => {
      const [name, value] = pair.trim().split("=");
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

/**
 * 쿠키 존재 여부 확인
 * @param name 쿠키 이름
 * @returns 존재 여부
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};
