'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Users } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedList } from '@/components/ui/AnimatedList';
import { CharacterCard } from '@/components/characters/CharacterCard';

export default function CharacterGroupPage() {
  const { projectId, groupId } = useParams<{ projectId: string; groupId: string }>();
  const hydrated = useHydration();
  const { getProject } = useProjectStore();
  const {
    addCharacter, deleteCharacter, renameCharacter, updateDescription, moveCharacter,
    getCharactersByGroup, getGroupsByProject,
    groups,
  } = useCharacterStore();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editTarget, setEditTarget] = useState<{ id: string; name: string; description: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<{ id: string; name: string } | null>(null);

  const project = getProject(projectId);
  const group = groups.find((g) => g.id === groupId);
  const groupChars = getCharactersByGroup(groupId);
  const allGroups = getGroupsByProject(projectId);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addCharacter(projectId, trimmed, groupId, newDescription.trim());
    setNewName('');
    setNewDescription('');
    setShowCreate(false);
  };

  const handleEdit = () => {
    if (!editTarget) return;
    const trimmed = editTarget.name.trim();
    if (!trimmed) return;
    renameCharacter(editTarget.id, trimmed);
    updateDescription(editTarget.id, editTarget.description.trim());
    setEditTarget(null);
  };

  const handleMove = (targetGroupId: string | null) => {
    if (!moveTarget) return;
    moveCharacter(moveTarget.id, targetGroupId);
    setMoveTarget(null);
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
        title={group?.name ?? 'グループ'}
        showBack
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
        {groupChars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <Users size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">キャラクターがいません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンで追加</p>
          </div>
        ) : (
          <AnimatedList>
            {groupChars.map((char) => (
              <CharacterCard
                key={char.id}
                id={char.id}
                name={char.name}
                description={char.description}
                onEdit={() => setEditTarget({ id: char.id, name: char.name, description: char.description ?? '' })}
                onDelete={() => setDeleteTarget(char.id)}
                onMove={() => setMoveTarget({ id: char.id, name: char.name })}
              />
            ))}
          </AnimatedList>
        )}
      </div>

      {/* Create character */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setNewName(''); setNewDescription(''); }}
        title="新しいキャラクター"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="キャラクター名..."
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="説明（任意）..."
          rows={2}
          className="mt-3 w-full rounded-lg bg-bg-tertiary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
        />
        <button
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          追加
        </button>
      </Modal>

      {/* Edit character */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="キャラクターを編集"
      >
        <input
          type="text"
          value={editTarget?.name ?? ''}
          onChange={(e) => editTarget && setEditTarget({ ...editTarget, name: e.target.value })}
          placeholder="名前"
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        <textarea
          value={editTarget?.description ?? ''}
          onChange={(e) => editTarget && setEditTarget({ ...editTarget, description: e.target.value })}
          placeholder="説明（任意）..."
          rows={2}
          className="mt-3 w-full rounded-lg bg-bg-tertiary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
        />
        <button
          onClick={handleEdit}
          disabled={!editTarget?.name.trim()}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          保存
        </button>
      </Modal>

      {/* Move to group */}
      <Modal
        isOpen={!!moveTarget}
        onClose={() => setMoveTarget(null)}
        title={`${moveTarget?.name ?? ''} の移動先`}
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleMove(null)}
            className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3 hover:bg-bg-elevated transition-colors text-left"
          >
            <span className="text-text-secondary text-sm">未分類</span>
          </button>
          {allGroups.filter((g) => g.id !== groupId).map((g) => (
            <button
              key={g.id}
              onClick={() => handleMove(g.id)}
              className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3 hover:bg-bg-elevated transition-colors text-left"
            >
              <span className="text-text-primary text-sm">{g.name}</span>
            </button>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteCharacter(deleteTarget)}
        title="キャラクターを削除"
        message="このキャラクターを削除しますか？"
      />

      <TabBar />
    </div>
  );
}
