'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
