'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-xl bg-bg-secondary p-5"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full py-2.5 bg-bg-tertiary text-text-secondary font-medium hover:bg-bg-elevated transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-full py-2.5 bg-red-600 text-white font-medium hover:bg-red-500 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
