'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, FolderPlus, Users } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { useFolderStore } from '@/stores/useFolderStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { ScriptCard } from '@/components/projects/ScriptCard';
import { FolderCard } from '@/components/projects/FolderCard';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type CreateMode = 'script' | 'folder' | null;

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const hydrated = useHydration();
  const { getProject } = useProjectStore();
  const { scripts, createScript, deleteScript, deleteScriptsByFolder } = useScriptStore();
  const { folders, createFolder, deleteFolder } = useFolderStore();

  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'script' | 'folder'; id: string } | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const project = getProject(projectId);
  const projectFolders = folders.filter((f) => f.projectId === projectId);
  const rootScripts = scripts.filter((s) => s.projectId === projectId && s.folderId === null);
  const isEmpty = projectFolders.length === 0 && rootScripts.length === 0;

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (createMode === 'script') {
      createScript(projectId, trimmed);
    } else if (createMode === 'folder') {
      createFolder(projectId, trimmed);
    }
    setNewName('');
    setCreateMode(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'script') {
      deleteScript(deleteTarget.id);
    } else {
      deleteScriptsByFolder(deleteTarget.id);
      deleteFolder(deleteTarget.id);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title={project?.name ?? 'プロジェクト'}
        showBack
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

      {/* Character management link */}
      <div className="px-4 pt-3">
        <Link
          href={`/projects/${projectId}/characters`}
          className="flex items-center gap-3 rounded-lg bg-bg-secondary p-3 hover:bg-bg-tertiary transition-colors"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
            <Users size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary text-sm">キャラクター管理</p>
            <p className="text-xs text-text-muted">登場人物の登録・グループ分け</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <FileText size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">まだ何もありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでフォルダや脚本を作成</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Folders first */}
            {projectFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                id={folder.id}
                projectId={projectId}
                name={folder.name}
                scriptCount={scripts.filter((s) => s.folderId === folder.id).length}
                onDelete={() => setDeleteTarget({ type: 'folder', id: folder.id })}
              />
            ))}
            {/* Then root scripts */}
            {rootScripts.map((script) => (
              <ScriptCard
                key={script.id}
                id={script.id}
                projectId={projectId}
                title={script.title}
                blockCount={script.blocks.length}
                updatedAt={script.updatedAt}
                onDelete={() => setDeleteTarget({ type: 'script', id: script.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add menu - choose folder or script */}
      <Modal
        isOpen={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        title="新規作成"
      >
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setShowAddMenu(false); setCreateMode('folder'); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <FolderPlus size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">フォルダ</p>
              <p className="text-sm text-text-muted">脚本をまとめるフォルダを作成</p>
            </div>
          </button>
          <button
            onClick={() => { setShowAddMenu(false); setCreateMode('script'); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <FileText size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">脚本</p>
              <p className="text-sm text-text-muted">新しい脚本を作成</p>
            </div>
          </button>
        </div>
      </Modal>

      {/* Create name input */}
      <Modal
        isOpen={createMode !== null}
        onClose={() => { setCreateMode(null); setNewName(''); }}
        title={createMode === 'folder' ? '新しいフォルダ' : '新しい脚本'}
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder={createMode === 'folder' ? 'フォルダ名を入力...' : '脚本のタイトルを入力...'}
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        <button
          onClick={handleCreate}
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
        title={deleteTarget?.type === 'folder' ? 'フォルダを削除' : '脚本を削除'}
        message={
          deleteTarget?.type === 'folder'
            ? 'このフォルダと中の脚本がすべて削除されます。この操作は取り消せません。'
            : 'この脚本を削除しますか？この操作は取り消せません。'
        }
      />

      <TabBar />
    </div>
  );
}
