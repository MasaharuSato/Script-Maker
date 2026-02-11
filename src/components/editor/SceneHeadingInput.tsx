'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';

interface SceneHeadingInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (location: string) => void;
  initialValue?: string;
}

export function SceneHeadingInput({ isOpen, onClose, onSubmit, initialValue = '' }: SceneHeadingInputProps) {
  const [location, setLocation] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setLocation(initialValue);
  }, [isOpen, initialValue]);

  const handleSubmit = () => {
    const trimmed = location.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setLocation('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="柱（シーン見出し）">
      <p className="text-text-muted text-sm mb-3">場所や時間を入力してください</p>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="例: アパート・花子の部屋・夜"
        autoFocus
        className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
      />
      <div className="mt-2 px-1">
        <p className="text-xs text-text-muted">
          プレビュー: <span className="text-accent font-bold">〇{location || '...'}</span>
        </p>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!location.trim()}
        className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        追加
      </button>
    </Modal>
  );
}
