'use client';

import { useState } from 'react';
import { Plus, Clapperboard } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { useFolderStore } from '@/stores/useFolderStore';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectCreateModal } from '@/components/projects/ProjectCreateModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function ProjectsPage() {
  const hydrated = useHydration();
  const { projects, createProject, deleteProject } = useProjectStore();
  const { scripts, deleteScriptsByProject } = useScriptStore();
  const { deleteFoldersByProject } = useFolderStore();
  const { deleteCharactersByProject, deleteGroupsByProject } = useCharacterStore();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteScriptsByProject(id);
    deleteFoldersByProject(id);
    deleteCharactersByProject(id);
    deleteGroupsByProject(id);
    deleteProject(id);
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="Script Maker" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        title="Script Maker"
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
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-muted mb-5">
              <Clapperboard size={40} className="text-accent" />
            </div>
            <p className="text-text-secondary font-medium mb-1">プロジェクトがありません</p>
            <p className="text-text-muted text-sm">右上の＋ボタンでプロジェクトを作成</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                scriptCount={scripts.filter((s) => s.projectId === project.id).length}
                onDelete={() => setDeleteTarget(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectCreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createProject}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="プロジェクトを削除"
        message="このプロジェクトと中の脚本がすべて削除されます。この操作は取り消せません。"
      />

      <TabBar />
    </div>
  );
}
