'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Users, Trash2, FolderPlus, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type CreateMode = 'character' | 'group' | null;

export default function CharactersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const hydrated = useHydration();
  const { getProject } = useProjectStore();
  const {
    addCharacter, deleteCharacter, renameCharacter, updateDescription, moveCharacter,
    getCharactersByProject, getCharactersByGroup, getUngroupedCharacters,
    addGroup, deleteGroup, renameGroup, getGroupsByProject,
  } = useCharacterStore();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'character' | 'group'; id: string } | null>(null);
  const [editTarget, setEditTarget] = useState<{ type: 'character' | 'group'; id: string; name: string; description?: string } | null>(null);
  const [moveTarget, setMoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const project = getProject(projectId);
  const allCharacters = getCharactersByProject(projectId);
  const groups = getGroupsByProject(projectId);
  const ungrouped = getUngroupedCharacters(projectId);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (createMode === 'character') {
      addCharacter(projectId, trimmed, targetGroupId, newDescription.trim());
    } else if (createMode === 'group') {
      addGroup(projectId, trimmed);
    }
    setNewName('');
    setNewDescription('');
    setCreateMode(null);
    setTargetGroupId(null);
  };

  const handleEdit = () => {
    if (!editTarget) return;
    const trimmed = editTarget.name.trim();
    if (!trimmed) return;
    if (editTarget.type === 'character') {
      renameCharacter(editTarget.id, trimmed);
      updateDescription(editTarget.id, editTarget.description?.trim() ?? '');
    } else {
      renameGroup(editTarget.id, trimmed);
    }
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'character') {
      deleteCharacter(deleteTarget.id);
    } else {
      deleteGroup(deleteTarget.id);
    }
  };

  const handleMove = (groupId: string | null) => {
    if (!moveTarget) return;
    moveCharacter(moveTarget.id, groupId);
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

  const isEmpty = allCharacters.length === 0 && groups.length === 0;

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title={`${project?.name ?? ''} キャラクター`}
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

      <div className="flex-1 px-4 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <Users size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">キャラクターがいません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでキャラクターを登録</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Groups */}
            {groups.map((group) => {
              const groupChars = getCharactersByGroup(group.id);
              const isCollapsed = collapsedGroups.has(group.id);
              return (
                <div key={group.id} className="rounded-lg bg-bg-secondary overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => toggleGroup(group.id)} className="text-text-muted">
                      {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button
                      onClick={() => setEditTarget({ type: 'group', id: group.id, name: group.name })}
                      className="flex-1 text-left"
                    >
                      <span className="font-semibold text-accent text-sm">{group.name}</span>
                      <span className="text-text-muted text-xs ml-2">({groupChars.length})</span>
                    </button>
                    <button
                      onClick={() => { setTargetGroupId(group.id); setCreateMode('character'); }}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-bg-tertiary transition-colors"
                    >
                      <Plus size={14} className="text-text-muted" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'group', id: group.id })}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-red-600/20 transition-colors"
                    >
                      <Trash2 size={14} className="text-text-muted hover:text-red-400" />
                    </button>
                  </div>
                  {!isCollapsed && groupChars.length > 0 && (
                    <div className="px-4 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {groupChars.map((char) => (
                          <CharacterChip
                            key={char.id}
                            name={char.name}
                            description={char.description}
                            onTap={() => setEditTarget({ type: 'character', id: char.id, name: char.name, description: char.description })}
                            onDelete={() => setDeleteTarget({ type: 'character', id: char.id })}
                            onMove={() => setMoveTarget({ id: char.id, name: char.name })}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {!isCollapsed && groupChars.length === 0 && (
                    <p className="px-4 pb-3 text-text-muted text-xs">キャラクターなし</p>
                  )}
                </div>
              );
            })}

            {/* Ungrouped */}
            {ungrouped.length > 0 && (
              <div className="rounded-lg bg-bg-secondary overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="px-4 py-3">
                  <span className="font-semibold text-text-secondary text-sm">未分類</span>
                  <span className="text-text-muted text-xs ml-2">({ungrouped.length})</span>
                </div>
                <div className="px-4 pb-3">
                  <div className="flex flex-wrap gap-2">
                    {ungrouped.map((char) => (
                      <CharacterChip
                        key={char.id}
                        name={char.name}
                        description={char.description}
                        onTap={() => setEditTarget({ type: 'character', id: char.id, name: char.name, description: char.description })}
                        onDelete={() => setDeleteTarget({ type: 'character', id: char.id })}
                        onMove={() => setMoveTarget({ id: char.id, name: char.name })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add menu */}
      <Modal isOpen={showAddMenu} onClose={() => setShowAddMenu(false)} title="追加">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setShowAddMenu(false); setTargetGroupId(null); setCreateMode('character'); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <UserPlus size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">キャラクター</p>
              <p className="text-sm text-text-muted">新しいキャラクターを追加</p>
            </div>
          </button>
          <button
            onClick={() => { setShowAddMenu(false); setCreateMode('group'); }}
            className="flex items-center gap-4 rounded-lg bg-bg-tertiary p-4 hover:bg-bg-elevated transition-colors text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted">
              <FolderPlus size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">グループ</p>
              <p className="text-sm text-text-muted">キャラクターをまとめるグループ</p>
            </div>
          </button>
        </div>
      </Modal>

      {/* Create input */}
      <Modal
        isOpen={createMode !== null}
        onClose={() => { setCreateMode(null); setNewName(''); setNewDescription(''); setTargetGroupId(null); }}
        title={createMode === 'group' ? '新しいグループ' : '新しいキャラクター'}
      >
        {createMode === 'character' && groups.length > 0 && (
          <div className="mb-3">
            <p className="text-text-muted text-sm mb-2">所属グループ</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTargetGroupId(null)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  targetGroupId === null
                    ? 'bg-accent text-black font-medium'
                    : 'bg-bg-tertiary text-text-secondary'
                }`}
              >
                未分類
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setTargetGroupId(g.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                    targetGroupId === g.id
                      ? 'bg-accent text-black font-medium'
                      : 'bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createMode === 'group' && handleCreate()}
          placeholder={createMode === 'group' ? 'グループ名...' : 'キャラクター名...'}
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        {createMode === 'character' && (
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="説明（任意）..."
            rows={2}
            className="mt-3 w-full rounded-lg bg-bg-tertiary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
          />
        )}
        <button
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          追加
        </button>
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={editTarget?.type === 'group' ? 'グループを編集' : 'キャラクターを編集'}
      >
        <input
          type="text"
          value={editTarget?.name ?? ''}
          onChange={(e) => editTarget && setEditTarget({ ...editTarget, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && editTarget?.type === 'group' && handleEdit()}
          placeholder="名前"
          autoFocus
          className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
        />
        {editTarget?.type === 'character' && (
          <textarea
            value={editTarget.description ?? ''}
            onChange={(e) => editTarget && setEditTarget({ ...editTarget, description: e.target.value })}
            placeholder="説明（任意）..."
            rows={2}
            className="mt-3 w-full rounded-lg bg-bg-tertiary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
          />
        )}
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
          {groups.map((g) => (
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
        onConfirm={handleDelete}
        title={deleteTarget?.type === 'group' ? 'グループを削除' : 'キャラクターを削除'}
        message={
          deleteTarget?.type === 'group'
            ? 'グループを削除します。中のキャラクターは未分類に移動します。'
            : 'このキャラクターを削除しますか？'
        }
      />

      <TabBar />
    </div>
  );
}

function CharacterChip({
  name,
  description,
  onTap,
  onDelete,
  onMove,
}: {
  name: string;
  description?: string;
  onTap: () => void;
  onDelete: () => void;
  onMove: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="rounded-lg bg-bg-tertiary px-4 py-2 text-left hover:bg-bg-elevated transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">{name}</span>
        {description && (
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{description}</p>
        )}
      </button>
      {showActions && (
        <div className="absolute top-full left-0 mt-1 z-10 flex gap-1 rounded-lg bg-bg-elevated p-1" style={{ boxShadow: 'var(--shadow-modal)' }}>
          <button
            onClick={() => { setShowActions(false); onTap(); }}
            className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            編集
          </button>
          <button
            onClick={() => { setShowActions(false); onMove(); }}
            className="rounded-md px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            移動
          </button>
          <button
            onClick={() => { setShowActions(false); onDelete(); }}
            className="rounded-md px-3 py-1.5 text-xs text-red-400 hover:bg-red-600/20 transition-colors"
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
