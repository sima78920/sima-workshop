import type { Prompt } from '../types';
import { PromptCard } from './PromptCard';

interface Props {
  notes?: string;
  prompts?: Prompt[];
}

/** 강사 화면 전용 사이드 패널: 진행 메모 + 교시 프롬프트 모음 */
export function NotesPanel({ notes, prompts }: Props) {
  return (
    <aside className="no-scrollbar h-full w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">강사 노트</h3>
      {notes ? (
        <p className="whitespace-pre-wrap rounded-lg bg-white p-3 text-sm leading-relaxed text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
          {notes}
        </p>
      ) : (
        <p className="text-sm text-slate-400">이 슬라이드에는 메모가 없습니다.</p>
      )}

      {prompts && prompts.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
            교시 프롬프트
          </h3>
          <div className="space-y-3">
            {prompts.map((p) => (
              <PromptCard key={p.id} label={p.label} tool={p.tool} text={p.text} note={p.note} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
