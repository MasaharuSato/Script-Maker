'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  createProject: (name: string) => Project;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  getProject: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      createProject: (name) => {
        const project: Project = {
          id: nanoid(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },
      deleteProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      renameProject: (id, name) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        })),
      getProject: (id) => get().projects.find((p) => p.id === id),
    }),
    {
      name: 'script-maker-projects',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
