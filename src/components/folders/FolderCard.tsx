'use client';

import Link from 'next/link';
import { Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FolderCardProps {
  id: string;
  name: string;
  scriptCount: number;
  updatedAt: string;
  onDelete: () => void;
}

export function FolderCard({ id, name, scriptCount, updatedAt, onDelete }: FolderCardProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="group relative rounded-lg bg-bg-secondary p-4 transition-all hover:bg-bg-tertiary active:scale-[0.98]"
      style={{ boxShadow: 'var(--shadow-card)' }}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowDelete(!showDelete);
      }}
    >
      <Link href={`/folders/${id}`} className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-muted">
          <Folder size={24} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{name}</p>
          <p className="text-sm text-text-muted mt-0.5">
            {scriptCount}本の脚本
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
