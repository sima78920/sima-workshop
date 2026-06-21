import type { Lecture } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { IconCheck, IconClose } from './ui/icons';

interface Props {
  lecture: Lecture;
  open: boolean;
  onClose: () => void;
}

/** 평가자 체크리스트 — 전체 교시 항목을 모아 보여주고 탭으로 체크 (상태 영구 저장) */
export function ChecklistPanel({ lecture, open, onClose }: Props) {
  const [checked, setChecked] = usePersistentState<Record<string, boolean>>(
    `checklist:${lecture.id}`,
    {},
  );

  const groups = lecture.sessions
    .filter((s) => s.checklist && s.checklist.length > 0)
    .map((s) => ({ title: s.title, order: s.order, items: s.checklist! }));

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const doneCount = groups.reduce(
    (n, g) => n + g.items.filter((it) => checked[it.id]).length,
    0,
  );

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-96 max-w-[90vw] transform overflow-y-auto bg-white shadow-xl transition-transform dark:bg-slate-900 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">평가 체크리스트</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {doneCount} / {total} 완료
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="닫기"
          >
            <IconClose width={20} height={20} />
          </button>
        </div>

        <div className="p-4">
          {groups.map((g) => (
            <div key={g.order} className="mb-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {g.order}교시 · {g.title}
              </h3>
              <ul className="space-y-2">
                {g.items.map((it) => {
                  const on = !!checked[it.id];
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => toggle(it.id)}
                        className="flex w-full items-start gap-3 rounded-lg p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                            on
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {on && <IconCheck width={16} height={16} />}
                        </span>
                        <span
                          className={`text-sm leading-relaxed ${
                            on
                              ? 'text-slate-400 line-through'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {it.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {total === 0 && (
            <p className="text-sm text-slate-400">등록된 체크리스트 항목이 없습니다.</p>
          )}
        </div>
      </aside>
    </>
  );
}
