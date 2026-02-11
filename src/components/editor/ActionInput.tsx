'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';

interface ActionInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialValue?: string;
}

export function ActionInput({ isOpen, onClose, onSubmit, initialValue = '' }: ActionInputProps) {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setText(initialValue);
  }, [isOpen, initialValue]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ト書き">
      <p className="text-text-muted text-sm mb-3">動作や情景を入力してください</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="例: 花子が窓を開ける。朝日が差し込む。"
        rows={4}
        autoFocus
        className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        追加
      </button>
    </Modal>
  );
}
