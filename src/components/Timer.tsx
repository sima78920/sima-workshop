import { useCountdown } from '../hooks/useCountdown';
import { formatMs } from '../lib/time';
import { IconPause, IconPlay, IconReset } from './ui/icons';

const PRESETS = [3, 5, 10, 15];

/** 강사용 수동 실습 카운트다운 타이머 */
export function Timer() {
  const { remainingMs, durationMs, running, start, pause, reset, setMinutes } = useCountdown();
  const danger = remainingMs <= 30 * 1000 && remainingMs > 0;
  const done = remainingMs <= 0;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`min-w-[64px] text-center font-mono text-lg font-bold tabular-nums ${
          done
            ? 'text-rose-500'
            : danger
              ? 'animate-pulse text-amber-500'
              : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {formatMs(remainingMs)}
      </span>
      <button
        onClick={running ? pause : start}
        className="rounded-lg bg-slate-200 p-2 text-slate-700 active:scale-95 dark:bg-slate-700 dark:text-slate-100"
        aria-label={running ? '일시정지' : '시작'}
      >
        {running ? <IconPause width={18} height={18} /> : <IconPlay width={18} height={18} />}
      </button>
      <button
        onClick={reset}
        className="rounded-lg bg-slate-200 p-2 text-slate-700 active:scale-95 dark:bg-slate-700 dark:text-slate-100"
        aria-label="리셋"
      >
        <IconReset width={18} height={18} />
      </button>
      <div className="hidden items-center gap-1 md:flex">
        {PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={`rounded-md px-2 py-1 text-xs font-semibold ${
              durationMs === m * 60 * 1000
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {m}분
          </button>
        ))}
      </div>
    </div>
  );
}
