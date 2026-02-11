'use client';

import type { ScriptBlock as ScriptBlockType } from '@/types';
import { Trash2, Pencil } from 'lucide-react';

interface ScriptBlockProps {
  block: ScriptBlockType;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScriptBlock({ block, onEdit, onDelete }: ScriptBlockProps) {
  return (
    <div className="group relative px-4 py-3 border-b border-border-light last:border-b-0">
      {block.type === 'scene_heading' && (
        <div>
          <p className="text-xl font-bold text-accent leading-relaxed">
            〇{block.location}
          </p>
        </div>
      )}
      {block.type === 'dialogue' && (
        <div>
          <p className="text-sm font-medium text-accent mb-1">{block.character}</p>
          <p className="text-text-primary leading-relaxed">「{block.text}」</p>
        </div>
      )}
      {block.type === 'action' && (
        <div>
          <p className="text-text-secondary leading-relaxed">{block.text}</p>
        </div>
      )}
      {/* Edit/Delete buttons - visible on hover/tap */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-tertiary hover:bg-bg-elevated transition-colors"
        >
          <Pencil size={12} className="text-text-muted" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-tertiary hover:bg-red-600/30 transition-colors"
        >
          <Trash2 size={12} className="text-text-muted" />
        </button>
      </div>
    </div>
  );
}
