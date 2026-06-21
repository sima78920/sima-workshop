import type { Lecture } from '../types';
import { IconClose } from './ui/icons';

interface Props {
  lecture: Lecture;
  open: boolean;
  currentSessionIndex: number;
  onClose: () => void;
  onSelect: (sessionIndex: number, slideIndex: number) => void;
}

/** 교시/슬라이드로 바로 이동하는 사이드 목차 */
export function AgendaDrawer({ lecture, open, currentSessionIndex, onClose, onSelect }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 max-w-[85vw] transform overflow-y-auto bg-white shadow-xl transition-transform dark:bg-slate-900 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">목차</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{lecture.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="닫기"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>

        <nav className="p-2">
          {lecture.sessions.map((session, si) => (
            <div key={session.id} className="mb-1">
              <button
                onClick={() => onSelect(si, 0)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${
                  si === currentSessionIndex
                    ? 'bg-indigo-50 dark:bg-indigo-900/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {session.isBreak ? '☕' : session.order}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {session.title}
                  </span>
                  {session.startTime && (
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {session.startTime} ~ {session.endTime}
                    </span>
                  )}
                </span>
              </button>
              {si === currentSessionIndex && session.slides.length > 1 && (
                <div className="ml-9 mt-1 space-y-0.5">
                  {session.slides.map((slide, sl) => (
                    <button
                      key={slide.id}
                      onClick={() => onSelect(si, sl)}
                      className="block w-full truncate rounded-md px-2 py-1 text-left text-xs text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      {sl + 1}. {slide.title ?? '슬라이드'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
