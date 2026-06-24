'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface Props {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
  error:   <XCircle    className="w-5 h-5 text-red-400    shrink-0" />,
  info:    <Info       className="w-5 h-5 text-blue-400   shrink-0" />,
};

const borders = {
  success: 'border-emerald-500/30',
  error:   'border-red-500/30',
  info:    'border-blue-500/30',
};

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onRemove, 280);
    }, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  return (
    <div
      className={`flex items-start gap-3 bg-zinc-900 border ${borders[toast.type]} 
                  rounded-2xl px-4 py-3 shadow-xl min-w-72 max-w-sm
                  ${exiting ? 'toast-exit' : 'toast-enter'}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{toast.title}</div>
        {toast.message && (
          <div className="text-xs text-zinc-400 mt-0.5">{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(onRemove, 280); }}
        className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onRemove={() => onRemove(t.id)} />
        </div>
      ))}
    </div>
  );
}
