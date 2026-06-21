import { useEffect, useState } from 'react';

const PREFIX = 'lecture-presenter:';

/** localStorage에 동기화되는 상태. 새로고침/홈화면 재실행에도 값이 유지된다. */
export function usePersistentState<T>(key: string, initial: T) {
  const fullKey = PREFIX + key;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {
      /* 저장 실패는 무시 (프라이빗 모드 등) */
    }
  }, [fullKey, value]);

  return [value, setValue] as const;
}
