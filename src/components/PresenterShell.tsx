import { useCallback, useEffect, useState } from 'react';
import type { Lecture } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { TopBar } from './TopBar';
import { SlideView } from './SlideView';
import { NotesPanel } from './NotesPanel';
import { AgendaDrawer } from './AgendaDrawer';
import { ChecklistPanel } from './ChecklistPanel';
import { IconCheck, IconChevronLeft, IconChevronRight } from './ui/icons';

interface Props {
  lecture: Lecture;
  dark: boolean;
  onToggleDark: () => void;
  onHome: () => void;
}

interface Position {
  session: number;
  slide: number;
}

export function PresenterShell({ lecture, dark, onToggleDark, onHome }: Props) {
  const [pos, setPos] = usePersistentState<Position>(`pos:${lecture.id}`, {
    session: 0,
    slide: 0,
  });
  const [notesVisible, setNotesVisible] = usePersistentState('notesVisible', false);
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  // 데이터 변경 등으로 위치가 범위를 벗어나면 보정
  const sessionIndex = Math.min(pos.session, lecture.sessions.length - 1);
  const session = lecture.sessions[sessionIndex];
  const slideIndex = Math.min(pos.slide, session.slides.length - 1);
  const slide = session.slides[slideIndex];

  const goNext = useCallback(() => {
    setPos((p) => {
      const s = lecture.sessions[Math.min(p.session, lecture.sessions.length - 1)];
      if (p.slide < s.slides.length - 1) return { session: p.session, slide: p.slide + 1 };
      if (p.session < lecture.sessions.length - 1) return { session: p.session + 1, slide: 0 };
      return p;
    });
  }, [lecture, setPos]);

  const goPrev = useCallback(() => {
    setPos((p) => {
      if (p.slide > 0) return { session: p.session, slide: p.slide - 1 };
      if (p.session > 0) {
        const prevSlides = lecture.sessions[p.session - 1].slides.length;
        return { session: p.session - 1, slide: prevSlides - 1 };
      }
      return p;
    });
  }, [lecture, setPos]);

  const jumpTo = useCallback(
    (s: number, sl: number) => {
      setPos({ session: s, slide: sl });
      setAgendaOpen(false);
    },
    [setPos],
  );

  // 키보드(외부 키보드/프레젠터 리모컨) 지원
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const isFirst = sessionIndex === 0 && slideIndex === 0;
  const isLast =
    sessionIndex === lecture.sessions.length - 1 && slideIndex === session.slides.length - 1;

  return (
    <div className="flex h-full flex-col">
      <TopBar
        lectureTitle={lecture.title}
        currentSessionTitle={session.isBreak ? session.title : `${session.order}교시 · ${session.title}`}
        sessions={lecture.sessions}
        notesVisible={notesVisible}
        dark={dark}
        onHome={onHome}
        onToggleAgenda={() => setAgendaOpen(true)}
        onToggleNotes={() => setNotesVisible((v) => !v)}
        onToggleDark={onToggleDark}
      />

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1">
          <SlideView slide={slide} onNext={goNext} onPrev={goPrev} />
        </main>
        {notesVisible && <NotesPanel notes={slide.notes} prompts={session.prompts} />}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="flex items-center gap-1 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 active:scale-95 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200"
        >
          <IconChevronLeft width={20} height={20} />
          이전
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          {session.slides.map((sl, i) => (
            <button
              key={sl.id}
              onClick={() => setPos({ session: sessionIndex, slide: i })}
              className={`h-2.5 rounded-full transition-all ${
                i === slideIndex
                  ? 'w-6 bg-indigo-500'
                  : 'w-2.5 bg-slate-300 dark:bg-slate-600'
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
          <span className="ml-3 text-xs font-medium tabular-nums text-slate-400">
            {slideIndex + 1} / {session.slides.length}
          </span>
        </div>

        <button
          onClick={() => setChecklistOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 active:scale-95 dark:bg-slate-800 dark:text-slate-200"
        >
          <IconCheck width={18} height={18} />
          <span className="hidden sm:inline">체크리스트</span>
        </button>

        <button
          onClick={goNext}
          disabled={isLast}
          className="flex items-center gap-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white active:scale-95 disabled:opacity-40"
        >
          다음
          <IconChevronRight width={20} height={20} />
        </button>
      </nav>

      <AgendaDrawer
        lecture={lecture}
        open={agendaOpen}
        currentSessionIndex={sessionIndex}
        onClose={() => setAgendaOpen(false)}
        onSelect={jumpTo}
      />
      <ChecklistPanel lecture={lecture} open={checklistOpen} onClose={() => setChecklistOpen(false)} />
    </div>
  );
}
