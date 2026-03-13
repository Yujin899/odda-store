'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToastStore, ToastMessage } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastIcon = ({ type }: { type: ToastMessage['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="size-4 stroke-[3px]" />;
    case 'error':
      return <AlertCircle className="size-4 stroke-[3px]" />;
    default:
      return <Info className="size-4 stroke-[3px]" />;
  }
};

export function Toast({ id, title, description, type }: ToastMessage) {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const typeStyles = {
    success: 'bg-(--primary) text-white',
    error: 'bg-(--destructive) text-white',
    info: 'bg-muted text-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'w-full max-w-[90vw] sm:max-w-sm sm:min-w-64 p-4 shadow-xl flex items-start gap-3 rounded-[var(--radius)] pointer-events-auto',
        typeStyles[type]
      )}
    >
      <div className="mt-0.5 shrink-0">
        <ToastIcon type={type} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold uppercase tracking-wide">{title}</h4>
        {description && <p className="text-xs mt-1 opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors opacity-60 hover:opacity-100 flex items-center justify-center border-none outline-none cursor-pointer bg-transparent"
      >
        <X className="size-4 stroke-[3px]" />
      </button>
    </motion.div>
  );
}
