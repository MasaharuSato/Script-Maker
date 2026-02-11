'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Character, CharacterGroup } from '@/types';

interface CharacterState {
  characters: Character[];
  groups: CharacterGroup[];
  // Characters
  addCharacter: (projectId: string, name: string, groupId?: string | null, description?: string, alias?: string) => Character;
  deleteCharacter: (id: string) => void;
  renameCharacter: (id: string, name: string) => void;
  updateAlias: (id: string, alias: string) => void;
  updateDescription: (id: string, description: string) => void;
  moveCharacter: (id: string, groupId: string | null) => void;
  getCharactersByProject: (projectId: string) => Character[];
  getCharactersByGroup: (groupId: string) => Character[];
  getUngroupedCharacters: (projectId: string) => Character[];
  deleteCharactersByProject: (projectId: string) => void;
  // Groups
  addGroup: (projectId: string, name: string) => CharacterGroup;
  deleteGroup: (id: string) => void;
  renameGroup: (id: string, name: string) => void;
  getGroupsByProject: (projectId: string) => CharacterGroup[];
  deleteGroupsByProject: (projectId: string) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: [],
      groups: [],

      addCharacter: (projectId, name, groupId = null, description = '', alias = '') => {
        const char: Character = {
          id: nanoid(),
          name,
          alias,
          description,
          projectId,
          groupId: groupId ?? null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ characters: [...state.characters, char] }));
        return char;
      },
      deleteCharacter: (id) =>
        set((state) => ({ characters: state.characters.filter((c) => c.id !== id) })),
      renameCharacter: (id, name) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, name } : c)),
        })),
      updateAlias: (id, alias) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, alias } : c)),
        })),
      updateDescription: (id, description) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, description } : c)),
        })),
      moveCharacter: (id, groupId) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, groupId } : c)),
        })),
      getCharactersByProject: (projectId) =>
        get().characters.filter((c) => c.projectId === projectId),
      getCharactersByGroup: (groupId) =>
        get().characters.filter((c) => c.groupId === groupId),
      getUngroupedCharacters: (projectId) =>
        get().characters.filter((c) => c.projectId === projectId && c.groupId === null),
      deleteCharactersByProject: (projectId) =>
        set((state) => ({ characters: state.characters.filter((c) => c.projectId !== projectId) })),

      addGroup: (projectId, name) => {
        const group: CharacterGroup = {
          id: nanoid(),
          name,
          projectId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ groups: [...state.groups, group] }));
        return group;
      },
      deleteGroup: (id) => {
        // Move characters in this group to ungrouped
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          characters: state.characters.map((c) =>
            c.groupId === id ? { ...c, groupId: null } : c
          ),
        }));
      },
      renameGroup: (id, name) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, name } : g)),
        })),
      getGroupsByProject: (projectId) =>
        get().groups.filter((g) => g.projectId === projectId),
      deleteGroupsByProject: (projectId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.projectId !== projectId),
        })),
    }),
    {
      name: 'script-maker-characters',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
