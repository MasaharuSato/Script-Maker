'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-sm rounded-xl bg-bg-secondary p-5"
            style={{ boxShadow: 'var(--shadow-card)' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 32,
              mass: 0.6,
            }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary text-sm mb-5">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-full py-2.5 bg-bg-tertiary text-text-secondary font-medium hover:bg-bg-elevated active:scale-95 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 rounded-full py-2.5 bg-red-600 text-white font-medium hover:bg-red-500 active:scale-95 transition-all"
              >
                削除
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
