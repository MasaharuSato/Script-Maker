'use client';

import { useState } from 'react';
import { Plus, Clapperboard } from 'lucide-react';
import { useFolderStore } from '@/stores/useFolderStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { FolderCard } from '@/components/folders/FolderCard';
import { FolderCreateModal } from '@/components/folders/FolderCreateModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function FoldersPage() {
  const hydrated = useHydration();
  const { folders, createFolder, deleteFolder } = useFolderStore();
  const { scripts, deleteScriptsByFolder } = useScriptStore();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteScriptsByFolder(id);
    deleteFolder(id);
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="Script Maker" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title="Script Maker"
        rightAction={
          <button
            onClick={() => setShowCreate(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-accent-light transition-colors"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={20} className="text-black" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <Clapperboard size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">フォルダがありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでフォルダを作成</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                scriptCount={scripts.filter((s) => s.folderId === folder.id).length}
                updatedAt={folder.updatedAt}
                onDelete={() => setDeleteTarget(folder.id)}
              />
            ))}
          </div>
        )}
      </div>

      <FolderCreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createFolder}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="フォルダを削除"
        message="このフォルダと中の脚本がすべて削除されます。この操作は取り消せません。"
      />
    </div>
  );
}
