'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useScriptStore } from '@/stores/useScriptStore';
import { useHydration } from '@/hooks/useHydration';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScriptDisplay } from '@/components/editor/ScriptDisplay';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SceneHeadingInput } from '@/components/editor/SceneHeadingInput';
import { DialogueInput } from '@/components/editor/DialogueInput';
import { ActionInput } from '@/components/editor/ActionInput';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ActiveInput, ScriptBlock } from '@/types';

export default function EditorPage() {
  const { scriptId } = useParams<{ projectId: string; scriptId: string }>();
  const hydrated = useHydration();
  const { scripts, addBlock, removeBlock, updateBlock, addCharacter } = useScriptStore();
  const script = scripts.find((s) => s.id === scriptId);

  const [activeInput, setActiveInput] = useState<ActiveInput>(null);
  const [editingBlock, setEditingBlock] = useState<ScriptBlock | null>(null);
  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null);

  const handleAddSceneHeading = (location: string) => {
    addBlock(scriptId, { type: 'scene_heading', location });
  };

  const handleAddDialogue = (character: string, text: string) => {
    addBlock(scriptId, { type: 'dialogue', character, text });
    if (script && !script.characters.includes(character)) {
      addCharacter(scriptId, character);
    }
  };

  const handleAddAction = (text: string) => {
    addBlock(scriptId, { type: 'action', text });
  };

  const handleEditBlock = (blockId: string) => {
    if (!script) return;
    const block = script.blocks.find((b) => b.id === blockId);
    if (block) {
      setEditingBlock(block);
      setActiveInput(block.type);
    }
  };

  const handleUpdateSceneHeading = (location: string) => {
    if (!editingBlock) return;
    updateBlock(scriptId, editingBlock.id, { location });
    setEditingBlock(null);
  };

  const handleUpdateDialogue = (character: string, text: string) => {
    if (!editingBlock) return;
    updateBlock(scriptId, editingBlock.id, { character, text });
    if (script && !script.characters.includes(character)) {
      addCharacter(scriptId, character);
    }
    setEditingBlock(null);
  };

  const handleUpdateAction = (text: string) => {
    if (!editingBlock) return;
    updateBlock(scriptId, editingBlock.id, { text });
    setEditingBlock(null);
  };

  const handleCloseInput = () => {
    setActiveInput(null);
    setEditingBlock(null);
  };

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="..." showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex flex-col min-h-dvh">
        <AppHeader title="エラー" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">脚本が見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh">
      <AppHeader title={script.title} showBack />

      <ScriptDisplay
        blocks={script.blocks}
        onEditBlock={handleEditBlock}
        onDeleteBlock={setDeleteBlockId}
      />

      <EditorToolbar onSelect={setActiveInput} />

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
        characters={script.characters}
        onAddCharacter={(name) => addCharacter(scriptId, name)}
      />
      <DialogueInput
        isOpen={activeInput === 'dialogue' && !!editingBlock}
        onClose={handleCloseInput}
        onSubmit={handleUpdateDialogue}
        characters={script.characters}
        onAddCharacter={(name) => addCharacter(scriptId, name)}
        initialCharacter={editingBlock?.type === 'dialogue' ? editingBlock.character : ''}
        initialText={editingBlock?.type === 'dialogue' ? editingBlock.text : ''}
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
        onConfirm={() => deleteBlockId && removeBlock(scriptId, deleteBlockId)}
        title="ブロックを削除"
        message="このブロックを削除しますか？"
      />
    </div>
  );
}
