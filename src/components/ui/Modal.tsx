'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dragControls = useDragControls();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Close if dragged down more than 80px or with fast velocity
    if (info.offset.y > 80 || info.velocity.y > 300) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-md rounded-t-2xl bg-bg-secondary p-5 pb-[calc(1.25rem+var(--safe-area-bottom))]"
            style={{ boxShadow: 'var(--shadow-modal)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 36,
              mass: 0.8,
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-text-muted/40"
              onPointerDown={(e) => dragControls.start(e)}
            />
            <div className="mb-4 mt-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary hover:text-text-primary active:scale-90 transition-all"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
