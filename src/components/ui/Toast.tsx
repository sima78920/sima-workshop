import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface ToastState {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastState>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 1600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center"
      >
        {message && (
          <div className="rounded-full bg-slate-900/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 dark:bg-white/90 dark:text-slate-900">
            {message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
