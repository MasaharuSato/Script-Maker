'use client';

import { Users, Trash2, ArrowRightLeft } from 'lucide-react';

interface CharacterCardProps {
  id: string;
  name: string;
  alias?: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
  onMove?: () => void;
}

export function CharacterCard({ name, alias, description, onEdit, onDelete, onMove }: CharacterCardProps) {
  return (
    <div
      className="relative rounded-lg bg-bg-secondary p-4 transition-all hover:bg-bg-tertiary active:scale-[0.98]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-3">
        {/* Tap area for edit */}
        <button
          onClick={onEdit}
          className="flex flex-1 items-center gap-3 min-w-0 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-muted">
            <Users size={20} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="font-semibold text-text-primary truncate">{name}</p>
              {alias && (
                <p className="text-xs text-accent shrink-0">({alias})</p>
              )}
            </div>
            {description ? (
              <p className="text-sm text-text-muted mt-0.5 truncate">{description}</p>
            ) : (
              <p className="text-sm text-text-muted mt-0.5">説明なし</p>
            )}
          </div>
        </button>

        {/* Always-visible actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onMove && (
            <button
              onClick={onMove}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg-elevated active:scale-90 transition-all"
            >
              <ArrowRightLeft size={14} className="text-text-muted" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-600/20 active:scale-90 transition-all"
          >
            <Trash2 size={14} className="text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
