'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Note } from '@/types';

interface NoteState {
  notes: Note[];
  createNote: (title?: string, folderId?: string | null) => Note;
  deleteNote: (id: string) => void;
  deleteNotesByFolder: (folderId: string) => void;
  updateNote: (id: string, updates: { title?: string; content?: string }) => void;
  moveNote: (id: string, folderId: string | null) => void;
  getNote: (id: string) => Note | undefined;
  getRootNotes: () => Note[];
  getNotesByFolder: (folderId: string) => Note[];
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      createNote: (title = '', folderId = null) => {
        const note: Note = {
          id: nanoid(),
          title,
          content: '',
          folderId: folderId ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
        return note;
      },
      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
      deleteNotesByFolder: (folderId) =>
        set((state) => ({ notes: state.notes.filter((n) => n.folderId !== folderId) })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      moveNote: (id, folderId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, folderId, updatedAt: new Date().toISOString() } : n
          ),
        })),
      getNote: (id) => get().notes.find((n) => n.id === id),
      getRootNotes: () => get().notes.filter((n) => n.folderId === null),
      getNotesByFolder: (folderId) => get().notes.filter((n) => n.folderId === folderId),
    }),
    {
      name: 'script-maker-notes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
