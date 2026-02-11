'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useScriptStore } from '@/stores/useScriptStore';
import { useFolderStore } from '@/stores/useFolderStore';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { TabBar } from '@/components/layout/TabBar';
import { ScriptDisplay } from '@/components/editor/ScriptDisplay';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SceneHeadingInput } from '@/components/editor/SceneHeadingInput';
import { DialogueInput } from '@/components/editor/DialogueInput';
import { ActionInput } from '@/components/editor/ActionInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ActiveInput, ScriptBlock, NewBlock } from '@/types';
import { nanoid } from 'nanoid';

export default function QuickEditorPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const { projects } = useProjectStore();
  const { createScript, addBlock: storeAddBlock } = useScriptStore();
  const { folders } = useFolderStore();
  const { getCharactersByProject, getGroupsByProject } = useCharacterStore();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<ScriptBlock[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [charProjectId, setCharProjectId] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<ActiveInput>(null);
  const [editingBlock, setEditingBlock] = useState<ScriptBlock | null>(null);
  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null);
  const [showSave, setShowSave] = useState(false);
  const [saveProjectId, setSaveProjectId] = useState<string | null>(null);
  const [saveFolderId, setSaveFolderId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const hasUnsavedWork = title.trim() !== '' || blocks.length > 0;

  const handleBeforeNavigate = useCallback((href: string): boolean => {
    if (!hasUnsavedWork) return true;
    setPendingNavigation(href);
    return false;
  }, [hasUnsavedWork]);

  const handleConfirmLeave = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const addBlock = (blockData: NewBlock) => {
    const block = {
      ...blockData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    } as ScriptBlock;
    setBlocks((prev) => [...prev, block]);
  };

  const handleAddSceneHeading = (location: string) => {
    addBlock({ type: 'scene_heading', location });
  };

  const handleAddDialogue = (character: string, text: string) => {
    addBlock({ type: 'dialogue', character, text });
    if (!characters.includes(character)) {
      setCharacters((prev) => [...prev, character]);
    }
  };

  const handleAddAction = (text: string) => {
    addBlock({ type: 'action', text });
  };

  const handleEditBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (block) {
      setEditingBlock(block);
      setActiveInput(block.type);
    }
  };

  const handleUpdateSceneHeading = (location: string) => {
    if (!editingBlock) return;
    setBlocks((prev) =>
      prev.map((b) => (b.id === editingBlock.id ? { ...b, location } as ScriptBlock : b))
    );
    setEditingBlock(null);
  };

  const handleUpdateDialogue = (character: string, text: string) => {
    if (!editingBlock) return;
    setBlocks((prev) =>
      prev.map((b) => (b.id === editingBlock.id ? { ...b, character, text } as ScriptBlock : b))
    );
    if (!characters.includes(character)) {
      setCharacters((prev) => [...prev, character]);
    }
    setEditingBlock(null);
  };

  const handleUpdateAction = (text: string) => {
    if (!editingBlock) return;
    setBlocks((prev) =>
      prev.map((b) => (b.id === editingBlock.id ? { ...b, text } as ScriptBlock : b))
    );
    setEditingBlock(null);
  };

  const handleCloseInput = () => {
    setActiveInput(null);
    setEditingBlock(null);
  };

  const handleDeleteBlock = () => {
    if (!deleteBlockId) return;
    setBlocks((prev) => prev.filter((b) => b.id !== deleteBlockId));
  };

  const handleSave = () => {
    if (!saveProjectId || blocks.length === 0) return;
    const scriptTitle = title.trim() || '無題の脚本';
    const script = createScript(saveProjectId, scriptTitle, saveFolderId);
    // Add all blocks to the script
    for (const block of blocks) {
      const { id: _id, createdAt: _createdAt, ...data } = block;
      storeAddBlock(script.id, data as NewBlock);
    }
    setShowSave(false);
    setSaved(true);
    // Reset editor after brief delay
    setTimeout(() => {
      setTitle('');
      setBlocks([]);
      setCharacters([]);
      setSaveProjectId(null);
      setSaveFolderId(null);
      setSaved(false);
    }, 2000);
  };

  const projectFolders = saveProjectId
    ? folders.filter((f) => f.projectId === saveProjectId)
    : [];

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="起稿" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh">
      <AppHeader
        title="起稿"
        rightAction={
          blocks.length > 0 ? (
            <button
              onClick={() => setShowSave(true)}
              className="flex h-9 items-center gap-1.5 px-3 rounded-full bg-accent hover:bg-accent-light transition-colors"
              style={{ boxShadow: 'var(--shadow-button)' }}
            >
              <Save size={16} className="text-black" />
              <span className="text-sm font-semibold text-black">保存</span>
            </button>
          ) : undefined
        }
      />

      {/* Title input */}
      <div className="px-4 pt-3 pb-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="脚本タイトル..."
          className="w-full bg-transparent text-lg font-bold text-text-primary placeholder:text-text-muted border-none focus:outline-none"
        />
      </div>

      {saved && (
        <div className="mx-4 mb-2 rounded-lg bg-accent/20 px-4 py-2 text-center text-sm font-medium text-accent">
          保存しました
        </div>
      )}

      <ScriptDisplay
        blocks={blocks}
        onEditBlock={handleEditBlock}
        onDeleteBlock={setDeleteBlockId}
      />

      <EditorToolbar onSelect={setActiveInput} />

      <TabBar onBeforeNavigate={handleBeforeNavigate} />

      <SceneHeadingInput
        isOpen={activeInput === 'scene_heading' && !editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleAddSceneHeading}
      />
      <SceneHeadingInput
        isOpen={activeInput === 'scene_heading' && !!editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleUpdateSceneHeading}
        initialValue={editingBlock?.type === 'scene_heading' ? editingBlock.location : ''}
      />

      <DialogueInput
        isOpen={activeInput === 'dialogue' && !editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleAddDialogue}
        characters={characters}
        onAddCharacter={(name) => setCharacters((prev) => [...prev, name])}
        projectCharacters={charProjectId ? getCharactersByProject(charProjectId) : undefined}
        characterGroups={charProjectId ? getGroupsByProject(charProjectId) : undefined}
        availableProjects={projects}
        selectedProjectId={charProjectId}
        onProjectChange={setCharProjectId}
      />
      <DialogueInput
        isOpen={activeInput === 'dialogue' && !!editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleUpdateDialogue}
        characters={characters}
        onAddCharacter={(name) => setCharacters((prev) => [...prev, name])}
        initialCharacter={editingBlock?.type === 'dialogue' ? editingBlock.character : ''}
        initialText={editingBlock?.type === 'dialogue' ? editingBlock.text : ''}
        projectCharacters={charProjectId ? getCharactersByProject(charProjectId) : undefined}
        characterGroups={charProjectId ? getGroupsByProject(charProjectId) : undefined}
        availableProjects={projects}
        selectedProjectId={charProjectId}
        onProjectChange={setCharProjectId}
      />

      <ActionInput
        isOpen={activeInput === 'action' && !editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleAddAction}
      />
      <ActionInput
        isOpen={activeInput === 'action' && !!editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleUpdateAction}
        initialValue={editingBlock?.type === 'action' ? editingBlock.text : ''}
      />

      <ConfirmDialog
        isOpen={!!deleteBlockId}
        onClose={() => setDeleteBlockId(null)}
        onConfirm={handleDeleteBlock}
        title="ブロックを削除"
        message="このブロックを削除しますか？"
      />

      <ConfirmDialog
        isOpen={!!pendingNavigation}
        onClose={() => setPendingNavigation(null)}
        onConfirm={handleConfirmLeave}
        title="ページを離れますか？"
        message="制作途中の内容が保存されていません。このまま移動すると内容が消えますが、よろしいですか？"
      />

      {/* Save destination modal */}
      <Modal
        isOpen={showSave}
        onClose={() => { setShowSave(false); setSaveProjectId(null); setSaveFolderId(null); }}
        title="保存先を選択"
      >
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {projects.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">
              プロジェクトがありません。先にファイルタブでプロジェクトを作成してください。
            </p>
          ) : (
            <>
              <p className="text-sm text-text-secondary font-medium">プロジェクト</p>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSaveProjectId(project.id);
                    setSaveFolderId(null);
                  }}
                  className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                    saveProjectId === project.id
                      ? 'bg-accent/20 border border-accent'
                      : 'bg-bg-tertiary hover:bg-bg-elevated border border-transparent'
                  }`}
                >
                  <span className="text-text-primary font-medium">{project.name}</span>
                </button>
              ))}

              {saveProjectId && projectFolders.length > 0 && (
                <>
                  <p className="text-sm text-text-secondary font-medium mt-2">フォルダ（任意）</p>
                  <button
                    onClick={() => setSaveFolderId(null)}
                    className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                      saveFolderId === null
                        ? 'bg-accent/20 border border-accent'
                        : 'bg-bg-tertiary hover:bg-bg-elevated border border-transparent'
                    }`}
                  >
                    <span className="text-text-secondary text-sm">ルート（フォルダなし）</span>
                  </button>
                  {projectFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSaveFolderId(folder.id)}
                      className={`flex items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                        saveFolderId === folder.id
                          ? 'bg-accent/20 border border-accent'
                          : 'bg-bg-tertiary hover:bg-bg-elevated border border-transparent'
                      }`}
                    >
                      <span className="text-text-primary text-sm">{folder.name}</span>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {saveProjectId && (
          <button
            onClick={handleSave}
            disabled={blocks.length === 0}
            className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-black hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
        )}
      </Modal>
    </div>
  );
}
