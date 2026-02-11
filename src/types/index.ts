export type BlockType = 'scene_heading' | 'dialogue' | 'action';

interface BlockBase {
  id: string;
  type: BlockType;
  createdAt: string;
}

export interface SceneHeadingBlock extends BlockBase {
  type: 'scene_heading';
  location: string;
}

export interface DialogueBlock extends BlockBase {
  type: 'dialogue';
  character: string;
  text: string;
}

export interface ActionBlock extends BlockBase {
  type: 'action';
  text: string;
}

export type ScriptBlock = SceneHeadingBlock | DialogueBlock | ActionBlock;

export type NewSceneHeadingBlock = { type: 'scene_heading'; location: string };
export type NewDialogueBlock = { type: 'dialogue'; character: string; text: string };
export type NewActionBlock = { type: 'action'; text: string };
export type NewBlock = NewSceneHeadingBlock | NewDialogueBlock | NewActionBlock;

export interface Script {
  id: string;
  title: string;
  projectId: string;
  folderId: string | null;
  blocks: ScriptBlock[];
  characters: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ActiveInput = 'scene_heading' | 'dialogue' | 'action' | null;

// メモ帳
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
