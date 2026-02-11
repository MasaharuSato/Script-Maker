'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';
import type { Character, CharacterGroup } from '@/types';

interface ProjectOption {
  id: string;
  name: string;
}

interface DialogueInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: string, text: string) => void;
  characters: string[];
  onAddCharacter: (name: string) => void;
  initialCharacter?: string;
  initialText?: string;
  projectCharacters?: Character[];
  characterGroups?: CharacterGroup[];
  // For project selector inside the modal (quick editor only)
  availableProjects?: ProjectOption[];
  selectedProjectId?: string | null;
  onProjectChange?: (projectId: string | null) => void;
}

export function DialogueInput({
  isOpen,
  onClose,
  onSubmit,
  characters,
  onAddCharacter,
  initialCharacter = '',
  initialText = '',
  projectCharacters,
  characterGroups,
  availableProjects,
  selectedProjectId,
  onProjectChange,
}: DialogueInputProps) {
  const [character, setCharacter] = useState(initialCharacter);
  const [text, setText] = useState(initialText);
  const [showNewChar, setShowNewChar] = useState(false);
  const [newCharName, setNewCharName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCharacter(initialCharacter);
      setText(initialText);
      setShowNewChar(false);
      setNewCharName('');
    }
  }, [isOpen, initialCharacter, initialText]);

  const handleAddCharacter = () => {
    const trimmed = newCharName.trim();
    if (!trimmed) return;
    onAddCharacter(trimmed);
    setCharacter(trimmed);
    setNewCharName('');
    setShowNewChar(false);
  };

  const handleSubmit = () => {
    if (!character.trim() || !text.trim()) return;
    onSubmit(character.trim(), text.trim());
    setCharacter('');
    setText('');
    onClose();
  };

  const hasGroupedChars = projectCharacters && projectCharacters.length > 0;
  const groups = characterGroups ?? [];
  const ungroupedProjectChars = projectCharacters?.filter((c) => c.groupId === null) ?? [];
  const projectCharDisplayNames = projectCharacters?.map((c) => c.alias || c.name) ?? [];
  const localOnlyChars = characters.filter((c) => !projectCharDisplayNames.includes(c));
  const selectedCharData = projectCharacters?.find((c) => (c.alias || c.name) === character);
  const getDisplayName = (c: Character) => c.alias || c.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="セリフ">
      {/* Character selection */}
      <div className="mb-4 max-h-[40vh] overflow-y-auto">
        <p className="text-text-muted text-sm mb-2">キャラクター</p>

        {/* Project selector (quick editor only) */}
        {availableProjects && availableProjects.length > 0 && onProjectChange && (
          <div className="mb-3">
            <p className="text-xs text-text-muted mb-1.5">キャラ参照</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onProjectChange(null)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  selectedProjectId === null || selectedProjectId === undefined
                    ? 'bg-bg-tertiary text-text-secondary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                なし
              </button>
              {availableProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onProjectChange(p.id)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    selectedProjectId === p.id
                      ? 'bg-accent/20 text-accent border border-accent'
                      : 'bg-bg-tertiary text-text-secondary hover:text-text-primary border border-transparent'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasGroupedChars ? (
          <div className="flex flex-col gap-3">
            {groups.map((group) => {
              const groupChars = projectCharacters!.filter((c) => c.groupId === group.id);
              if (groupChars.length === 0) return null;
              return (
                <div key={group.id}>
                  <p className="text-xs font-medium text-accent mb-1.5">{group.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {groupChars.map((c) => {
                      const display = getDisplayName(c);
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCharacter(display)}
                          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                            character === display
                              ? 'bg-accent text-black'
                              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {display}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {ungroupedProjectChars.length > 0 && (
              <div>
                {groups.length > 0 && (
                  <p className="text-xs font-medium text-text-muted mb-1.5">未分類</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ungroupedProjectChars.map((c) => {
                    const display = getDisplayName(c);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCharacter(display)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                          character === display
                            ? 'bg-accent text-black'
                            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {display}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {localOnlyChars.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-1.5">この脚本のみ</p>
                <div className="flex flex-wrap gap-2">
                  {localOnlyChars.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCharacter(c)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        character === c
                          ? 'bg-accent text-black'
                          : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowNewChar(true)}
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
              >
                <Plus size={14} />
                追加
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {characters.map((c) => (
              <button
                key={c}
                onClick={() => setCharacter(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  character === c
                    ? 'bg-accent text-black'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setShowNewChar(true)}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
            >
              <Plus size={14} />
              追加
            </button>
          </div>
        )}

        {showNewChar && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCharacter()}
              placeholder="キャラ名..."
              autoFocus
              className="flex-1 rounded-lg bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors"
            />
            <button
              onClick={handleAddCharacter}
              disabled={!newCharName.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black disabled:opacity-40"
            >
              OK
            </button>
          </div>
        )}

        {selectedCharData && (selectedCharData.description || (selectedCharData.alias && selectedCharData.name !== selectedCharData.alias)) && (
          <div className="mt-2 rounded-md bg-bg-tertiary/50 px-3 py-2">
            {selectedCharData.alias && (
              <p className="text-xs text-text-secondary mb-0.5">{selectedCharData.name}</p>
            )}
            {selectedCharData.description && (
              <p className="text-xs text-text-muted">{selectedCharData.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Dialogue text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="セリフを入力..."
        rows={3}
        className="w-full rounded-lg bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted border border-border focus:border-accent transition-colors resize-none"
      />

      {character && text && (
        <div className="mt-2 px-1">
          <p className="text-xs text-text-muted">
            プレビュー: <span className="text-accent">{character}</span>{' '}
            <span className="text-text-primary">「{text}」</span>
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!character.trim() || !text.trim()}
        className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        追加
      </button>
    </Modal>
  );
}
