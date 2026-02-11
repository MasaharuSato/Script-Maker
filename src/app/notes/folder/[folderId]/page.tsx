'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, StickyNote } from 'lucide-react';
import { useNoteStore } from '@/stores/useNoteStore';
import { useNoteFolderStore } from '@/stores/useNoteFolderStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { NoteCard } from '@/components/notes/NoteCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function NoteFolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const router = useRouter();
  const hydrated = useHydration();
  const { notes, createNote, deleteNote } = useNoteStore();
  const { getFolder } = useNoteFolderStore();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const folder = getFolder(folderId);
  const folderNotes = notes.filter((n) => n.folderId === folderId);

  const handleCreateNote = () => {
    const note = createNote('', folderId);
    router.push(`/notes/${note.id}`);
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title={folder?.name ?? 'フォルダ'}
        showBack
        rightAction={
          <button
            onClick={handleCreateNote}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-accent-light transition-colors"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={20} className="text-black" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {folderNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <StickyNote size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">メモがありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでメモを作成</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {folderNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                updatedAt={note.updatedAt}
                onDelete={() => setDeleteTarget(note.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteNote(deleteTarget)}
        title="メモを削除"
        message="このメモを削除しますか？"
      />

      <TabBar />
    </div>
  );
}
