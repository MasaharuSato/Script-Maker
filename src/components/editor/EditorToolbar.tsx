'use client';

import { Landmark, MessageCircle, PenLine } from 'lucide-react';
import type { ActiveInput } from '@/types';

interface EditorToolbarProps {
  onSelect: (type: ActiveInput) => void;
}

export function EditorToolbar({ onSelect }: EditorToolbarProps) {
  return (
    <div
      className="sticky bottom-0 flex items-center justify-around px-4 py-3 pb-[calc(0.75rem+var(--safe-area-bottom))] bg-bg-secondary/95 backdrop-blur-md border-t border-border-light"
      style={{ boxShadow: 'var(--shadow-toolbar)' }}
    >
      <button
        onClick={() => onSelect('scene_heading')}
        className="flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl hover:bg-bg-tertiary active:scale-95 transition-all"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted"
          style={{ boxShadow: 'var(--shadow-button)' }}
        >
          <Landmark size={22} className="text-accent" />
        </div>
        <span className="text-xs font-medium text-text-secondary">柱</span>
      </button>

      <button
        onClick={() => onSelect('dialogue')}
        className="flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl hover:bg-bg-tertiary active:scale-95 transition-all"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent"
          style={{ boxShadow: '0 4px 16px rgba(29, 185, 84, 0.4)' }}
        >
          <MessageCircle size={26} className="text-black" />
        </div>
        <span className="text-xs font-semibold text-accent">セリフ</span>
      </button>

      <button
        onClick={() => onSelect('action')}
        className="flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl hover:bg-bg-tertiary active:scale-95 transition-all"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted"
          style={{ boxShadow: 'var(--shadow-button)' }}
        >
          <PenLine size={22} className="text-accent" />
        </div>
        <span className="text-xs font-medium text-text-secondary">ト書き</span>
      </button>
    </div>
  );
}
