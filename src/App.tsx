import { useEffect } from 'react';
import { getLecture, lectures } from './lectures';
import { usePersistentState } from './hooks/usePersistentState';
import { ToastProvider } from './components/ui/Toast';
import { LecturePicker } from './components/LecturePicker';
import { PresenterShell } from './components/PresenterShell';

export function App() {
  const [dark, setDark] = usePersistentState('dark', true);
  const [selectedId, setSelectedId] = usePersistentState<string | null>('selectedLecture', null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const lecture = selectedId ? getLecture(selectedId) : undefined;
  const toggleDark = () => setDark((d) => !d);

  return (
    <ToastProvider>
      {lecture ? (
        <PresenterShell
          lecture={lecture}
          dark={dark}
          onToggleDark={toggleDark}
          onHome={() => setSelectedId(null)}
        />
      ) : (
        <LecturePicker
          lectures={lectures}
          dark={dark}
          onToggleDark={toggleDark}
          onSelect={setSelectedId}
        />
      )}
    </ToastProvider>
  );
}
