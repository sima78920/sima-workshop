import type { PromptTool } from '../types';
import { copyText } from '../lib/clipboard';
import { useToast } from './ui/Toast';
import { IconCopy } from './ui/icons';

const TOOL_LABEL: Record<PromptTool, string> = {
  midjourney: 'Midjourney',
  chatgpt: 'ChatGPT',
  comfyui: 'ComfyUI',
  photoshop: 'Photoshop',
  etc: '기타',
};

const TOOL_COLOR: Record<PromptTool, string> = {
  midjourney: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
  chatgpt: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  comfyui: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  photoshop: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  etc: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
};

interface Props {
  label: string;
  tool: PromptTool;
  text: string;
  note?: string;
}

/** 탭 한 번으로 복사되는 프롬프트 카드 */
export function PromptCard({ label, tool, text, note }: Props) {
  const toast = useToast();

  const handleCopy = async () => {
    const ok = await copyText(text);
    toast.show(ok ? '프롬프트 복사됨 ✓' : '복사 실패 — 직접 선택해 주세요');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${TOOL_COLOR[tool]}`}
          >
            {TOOL_LABEL[tool]}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white active:scale-95 dark:bg-white dark:text-slate-900"
        >
          <IconCopy width={14} height={14} />
          복사
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-3 text-sm leading-relaxed text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
        {text}
      </pre>
      {note && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{note}</p>}
    </div>
  );
}
