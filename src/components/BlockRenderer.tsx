import type { Block } from '../types';
import { PromptCard } from './PromptCard';

const CALLOUT_STYLE = {
  tip: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
  warn: 'border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  key: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200',
} as const;

const CALLOUT_LABEL = { tip: 'TIP', warn: '주의', key: '핵심' } as const;

/** 슬라이드 콘텐츠 블록 1개를 렌더링 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {block.text}
        </h3>
      );
    case 'text':
      return (
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 sm:text-xl">
          {block.text}
        </p>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`space-y-2 pl-6 text-lg text-slate-700 dark:text-slate-300 sm:text-xl ${
            block.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </Tag>
      );
    }
    case 'image':
      return (
        <figure className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <img src={block.src} alt={block.caption ?? ''} className="max-h-[55vh] w-full object-contain" />
          {block.caption && (
            <figcaption className="bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
          <code>{block.code}</code>
        </pre>
      );
    case 'callout':
      return (
        <div className={`rounded-xl border-l-4 px-4 py-3 ${CALLOUT_STYLE[block.tone]}`}>
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide opacity-70">
            {CALLOUT_LABEL[block.tone]}
          </span>
          <p className="text-base leading-relaxed sm:text-lg">{block.text}</p>
        </div>
      );
    case 'prompt':
      return <PromptCard label={block.label} tool={block.tool} text={block.text} />;
    default:
      return null;
  }
}
