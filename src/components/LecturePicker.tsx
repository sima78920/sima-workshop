import type { Lecture } from '../types';
import { IconMoon, IconSun } from './ui/icons';

interface Props {
  lectures: Lecture[];
  dark: boolean;
  onToggleDark: () => void;
  onSelect: (lectureId: string) => void;
}

/** 시작 화면: 등록된 강의 목록 */
export function LecturePicker({ lectures, dark, onToggleDark, onSelect }: Props) {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              강의 발표 도움툴
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              진행할 강의를 선택하세요.
            </p>
          </div>
          <button
            onClick={onToggleDark}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="다크모드"
          >
            {dark ? <IconSun width={22} height={22} /> : <IconMoon width={22} height={22} />}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {lectures.map((lecture) => {
            const teaching = lecture.sessions.filter((s) => !s.isBreak);
            return (
              <button
                key={lecture.id}
                onClick={() => onSelect(lecture.id)}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800"
              >
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {lecture.title}
                </h2>
                {lecture.subtitle && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {lecture.subtitle}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {lecture.date && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {lecture.date}
                    </span>
                  )}
                  <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {teaching.length}개 교시
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          홈 화면에 추가하면 앱처럼 오프라인에서도 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
