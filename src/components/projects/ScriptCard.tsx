'use client';

import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';

interface ScriptCardProps {
  id: string;
  projectId: string;
  title: string;
  blockCount: number;
  updatedAt: string;
  onDelete: () => void;
}

export function ScriptCard({ id, projectId, title, blockCount, updatedAt, onDelete }: ScriptCardProps) {
  const date = new Date(updatedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <div
      className="group relative rounded-lg bg-bg-secondary p-4 transition-all hover:bg-bg-tertiary active:scale-[0.98]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <Link href={`/projects/${projectId}/${id}`} className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-muted">
          <FileText size={24} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{title}</p>
          <p className="text-sm text-text-muted mt-0.5">
            {blockCount}ブロック・{dateStr}
          </p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600/20 transition-all"
      >
        <Trash2 size={16} className="text-text-muted hover:text-red-400" />
      </button>
    </div>
  );
}
