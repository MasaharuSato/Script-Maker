'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, StickyNote, FolderPlus, FileText } from 'lucide-react';
import { useNoteStore } from '@/stores/useNoteStore';
import { useNoteFolderStore } from '@/stores/useNoteFolderStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteFolderCard } from '@/components/notes/NoteFolderCard';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type CreateMode = 'note' | 'folder' | null;

export default function NotesPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { notes, createNote, deleteNote, deleteNotesByFolder } = useNoteStore();
  const { folders, createFolder, deleteFolder } = useNoteFolderStore();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'note' | 'folder'; id: string } | null>(null);

  const rootNotes = notes.filter((n) => n.folderId === null);

  const handleCreateNote = () => {
    const note = createNote();
    router.push(`/notes/${note.id}`);
  };

  const handleCreateFolder = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createFolder(trimmed);
    setNewName('');
    setCreateMode(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'note') {
      deleteNote(deleteTarget.id);
    } else {
      deleteNotesByFolder(deleteTarget.id);
      deleteFolder(deleteTarget.id);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="メモ帳" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
        <TabBar />
      </div>
    );
  }

  const isEmpty = folders.length === 0 && rootNotes.length === 0;

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title="メモ帳"
        rightAction={
          <button
            onClick={() => setShowAddMenu(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-accent-light transition-colors"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={20} className="text-black" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <StickyNote size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">メモがありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでメモを作成</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {folders.map((folder) => (
              <NoteFolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                noteCount={notes.filter((n) => n.folderId === folder.id).length}
                onDelete={() => setDeleteTarget({ type: 'folder', id: folder.id })}
              />
            ))}
            {rootNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                updatedAt={note.updatedAt}
                onDelete={() => setDeleteTarget({ type: 'note', id: note.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add menu */}
      <Modal
        isOpen={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        title="新規作成"
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setShowAddMenu(false); handleCreateNote(); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <FileText size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">メモ</p>
              <p className="text-sm text-text-muted">新しいメモを作成</p>
            </div>
          </button>
          <button
            onClick={() => { setShowAddMenu(false); setCreateMode('folder'); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <FolderPlus size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">フォルダ</p>
              <p className="text-sm text-text-muted">メモをまとめるフォルダを作成</p>
            </div>
          </button>
        </div>
      </Modal>

      {/* Folder name input */}
      <Modal
        isOpen={createMode === 'folder'}
        onClose={() => { setCreateMode(null); setNewName(''); }}
        title="新しいフォルダ"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          placeholder="フォルダ名を入力..."
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        <button
          onClick={handleCreateFolder}
          disabled={!newName.trim()}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          作成
        </button>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.type === 'folder' ? 'フォルダを削除' : 'メモを削除'}
        message={
          deleteTarget?.type === 'folder'
            ? 'このフォルダと中のメモがすべて削除されます。'
            : 'このメモを削除しますか？'
        }
      />

      <TabBar />
    </div>
  );
}
