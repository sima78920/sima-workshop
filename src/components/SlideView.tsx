import { useRef } from 'react';
import type { Slide } from '../types';
import { BlockRenderer } from './BlockRenderer';

interface Props {
  slide: Slide;
  onNext: () => void;
  onPrev: () => void;
}

/** 슬라이드 본문 + 좌우 스와이프 제스처 */
export function SlideView({ slide, onNext, onPrev }: Props) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    // 가로 스와이프가 세로보다 충분히 클 때만 페이지 전환 (스크롤과 구분)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNext();
      else onPrev();
    }
    startX.current = null;
    startY.current = null;
  };

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto px-6 py-6 sm:px-10 sm:py-8"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {slide.title && (
          <h2 className="border-b border-slate-200 pb-3 text-lg font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {slide.title}
          </h2>
        )}
        {slide.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
