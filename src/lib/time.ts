import type { Session } from '../types';

/** "10:00" → 분 단위(600). 잘못된 값이면 null */
export function parseHm(hm?: string): number | null {
  if (!hm) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** ms → "MM:SS" */
export function formatMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Date → "HH:MM:SS" (24시간) */
export function formatClock(d: Date): string {
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export interface ScheduleStatus {
  /** 현재 시각 기준 진행 중인 교시의 index (없으면 -1) */
  activeIndex: number;
  /** 현재 교시 진행률 0~1 */
  progress: number;
  /** 현재 교시 종료까지 남은 분 (없으면 null) */
  remainingMin: number | null;
}

/** 실제 시각(now) 기준으로 시간표상 현재 교시와 진행률을 계산 */
export function getScheduleStatus(sessions: Session[], now: Date): ScheduleStatus {
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  for (let i = 0; i < sessions.length; i++) {
    const start = parseHm(sessions[i].startTime);
    const end = parseHm(sessions[i].endTime);
    if (start === null || end === null || end <= start) continue;
    if (nowMin >= start && nowMin < end) {
      const progress = (nowMin - start) / (end - start);
      return { activeIndex: i, progress, remainingMin: end - nowMin };
    }
  }
  return { activeIndex: -1, progress: 0, remainingMin: null };
}
