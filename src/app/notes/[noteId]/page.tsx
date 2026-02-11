'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { useNoteStore } from '@/stores/useNoteStore';
import { useHydration } from '@/hooks/useHydration';

export default function NoteEditorPage() {
  const { noteId } = useParams<{ noteId: string }>();
  const router = useRouter();
  const hydrated = useHydration();
  const { getNote, updateNote } = useNoteStore();

  const note = getNote(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    if (!hasChanges) return;
    updateNote(noteId, { title, content });
    setHasChanges(false);
  }, [noteId, title, content, hasChanges, updateNote]);

  const handleBack = () => {
    if (hasChanges) {
      updateNote(noteId, { title, content });
    }
    router.back();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHasChanges(true);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setHasChanges(true);
  };

  // Auto-save on interval
  useEffect(() => {
    if (!hasChanges) return;
    const timer = setTimeout(() => {
      updateNote(noteId, { title, content });
      setHasChanges(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content, hasChanges, noteId, updateNote]);

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh bg-bg-primary">
        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-light">
          <div className="h-5 w-20 bg-bg-tertiary rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col min-h-dvh">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-light">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">エラー</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">メモが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-light">
        <button
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-tertiary transition-colors"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
        <div className="flex-1" />
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex h-9 items-center gap-1.5 px-3 rounded-full bg-accent hover:bg-accent-light transition-colors"
          >
            <Check size={16} className="text-black" />
            <span className="text-sm font-semibold text-black">保存</span>
          </button>
        )}
        {!hasChanges && (
          <span className="text-xs text-text-muted">保存済み</span>
        )}
      </header>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-4 pt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="タイトル"
            className="w-full bg-transparent text-xl font-bold text-text-primary placeholder:text-text-muted border-none focus:outline-none"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="メモを入力..."
          className="flex-1 w-full resize-none bg-transparent px-4 py-3 text-text-primary placeholder:text-text-muted border-none focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
}
