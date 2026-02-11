'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Folder } from '@/types';

interface FolderState {
  folders: Folder[];
  createFolder: (name: string) => Folder;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  getFolder: (id: string) => Folder | undefined;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      folders: [],
      createFolder: (name) => {
        const folder: Folder = {
          id: nanoid(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return folder;
      },
      deleteFolder: (id) =>
        set((state) => ({ folders: state.folders.filter((f) => f.id !== id) })),
      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, name, updatedAt: new Date().toISOString() } : f
          ),
        })),
      getFolder: (id) => get().folders.find((f) => f.id === id),
    }),
    {
      name: 'script-maker-folders',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
