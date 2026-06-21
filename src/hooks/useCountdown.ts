import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 강사가 실습 시간을 재는 수동 카운트다운 타이머.
 * 지정한 분(minutes)으로 설정 → 시작/일시정지/리셋.
 */
export function useCountdown() {
  const [durationMs, setDurationMs] = useState(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remainingMs;
    const id = setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      setRemainingMs(left);
      if (left <= 0) setRunning(false);
    }, 250);
    return () => clearInterval(id);
    // running이 바뀔 때만 인터벌을 재구성한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = useCallback(() => {
    if (remainingMs <= 0) setRemainingMs(durationMs);
    setRunning(true);
  }, [remainingMs, durationMs]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setRemainingMs(durationMs);
  }, [durationMs]);

  const setMinutes = useCallback((min: number) => {
    const ms = Math.max(0, Math.round(min)) * 60 * 1000;
    setDurationMs(ms);
    setRemainingMs(ms);
    setRunning(false);
  }, []);

  return { remainingMs, durationMs, running, start, pause, reset, setMinutes };
}
