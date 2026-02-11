'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function ProjectCreateModal({ isOpen, onClose, onCreate }: ProjectCreateModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="新しいプロジェクト">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="プロジェクト名を入力..."
        autoFocus
        className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        作成
      </button>
    </Modal>
  );
}
