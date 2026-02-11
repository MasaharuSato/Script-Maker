'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';

interface DialogueInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: string, text: string) => void;
  characters: string[];
  onAddCharacter: (name: string) => void;
  initialCharacter?: string;
  initialText?: string;
}

export function DialogueInput({
  isOpen,
  onClose,
  onSubmit,
  characters,
  onAddCharacter,
  initialCharacter = '',
  initialText = '',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="セリフ">
      {/* Character selection */}
      <div className="mb-4">
        <p className="text-text-muted text-sm mb-2">キャラクター</p>
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
