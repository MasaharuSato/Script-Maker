'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Script, ScriptBlock, NewBlock } from '@/types';

interface ScriptState {
  scripts: Script[];
  createScript: (folderId: string, title: string) => Script;
  deleteScript: (id: string) => void;
  deleteScriptsByFolder: (folderId: string) => void;
  renameScript: (id: string, title: string) => void;
  getScript: (id: string) => Script | undefined;
  getScriptsByFolder: (folderId: string) => Script[];
  addBlock: (scriptId: string, block: NewBlock) => void;
  removeBlock: (scriptId: string, blockId: string) => void;
  updateBlock: (scriptId: string, blockId: string, updates: Record<string, string>) => void;
  addCharacter: (scriptId: string, name: string) => void;
}

export const useScriptStore = create<ScriptState>()(
  persist(
    (set, get) => ({
      scripts: [],
      createScript: (folderId, title) => {
        const script: Script = {
          id: nanoid(),
          title,
          folderId,
          blocks: [],
          characters: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ scripts: [...state.scripts, script] }));
        return script;
      },
      deleteScript: (id) =>
        set((state) => ({ scripts: state.scripts.filter((s) => s.id !== id) })),
      deleteScriptsByFolder: (folderId) =>
        set((state) => ({ scripts: state.scripts.filter((s) => s.folderId !== folderId) })),
      renameScript: (id, title) =>
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s
          ),
        })),
      getScript: (id) => get().scripts.find((s) => s.id === id),
      getScriptsByFolder: (folderId) =>
        get().scripts.filter((s) => s.folderId === folderId),
      addBlock: (scriptId, blockData) => {
        const block = {
          ...blockData,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        } as ScriptBlock;
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === scriptId
              ? { ...s, blocks: [...s.blocks, block], updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },
      removeBlock: (scriptId, blockId) =>
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === scriptId
              ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId), updatedAt: new Date().toISOString() }
              : s
          ),
        })),
      updateBlock: (scriptId, blockId, updates) =>
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === scriptId
              ? {
                  ...s,
                  blocks: s.blocks.map((b) =>
                    b.id === blockId ? ({ ...b, ...updates } as ScriptBlock) : b
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        })),
      addCharacter: (scriptId, name) =>
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === scriptId && !s.characters.includes(name)
              ? { ...s, characters: [...s.characters, name] }
              : s
          ),
        })),
    }),
    {
      name: 'script-maker-scripts',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
