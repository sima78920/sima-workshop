import type { Session } from '../types';
import { useClock } from '../hooks/useClock';
import { formatClock, getScheduleStatus } from '../lib/time';
import { Timer } from './Timer';
import { IconHome, IconList, IconMoon, IconNote, IconSun } from './ui/icons';

interface Props {
  lectureTitle: string;
  currentSessionTitle: string;
  sessions: Session[];
  notesVisible: boolean;
  dark: boolean;
  onHome: () => void;
  onToggleAgenda: () => void;
  onToggleNotes: () => void;
  onToggleDark: () => void;
}

export function TopBar({
  lectureTitle,
  currentSessionTitle,
  sessions,
  notesVisible,
  dark,
  onHome,
  onToggleAgenda,
  onToggleNotes,
  onToggleDark,
}: Props) {
  const now = useClock();
  const status = getScheduleStatus(sessions, now);
  const remaining =
    status.remainingMin !== null ? `이 교시 ${Math.ceil(status.remainingMin)}분 남음` : '시간표 외';

  const iconBtn =
    'rounded-lg p-2 text-slate-600 hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={onHome} className={iconBtn} aria-label="강의 목록">
          <IconHome width={20} height={20} />
        </button>
        <button onClick={onToggleAgenda} className={iconBtn} aria-label="목차">
          <IconList width={20} height={20} />
        </button>

        <div className="min-w-0 flex-1 px-1">
          <div className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {currentSessionTitle}
          </div>
          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
            {lectureTitle} · {remaining}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="font-mono text-base font-semibold tabular-nums text-slate-700 dark:text-slate-200">
              {formatClock(now)}
            </div>
          </div>
          <Timer />
          <button
            onClick={onToggleNotes}
            className={`${iconBtn} ${notesVisible ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : ''}`}
            aria-label="강사 노트"
          >
            <IconNote width={20} height={20} />
          </button>
          <button onClick={onToggleDark} className={iconBtn} aria-label="다크모드">
            {dark ? <IconSun width={20} height={20} /> : <IconMoon width={20} height={20} />}
          </button>
        </div>
      </div>

      {/* 현재 교시 진행바 (실제 시각 기준) */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-[width] duration-1000 ease-linear"
          style={{ width: `${Math.round(status.progress * 100)}%` }}
        />
      </div>
    </header>
  );
}
