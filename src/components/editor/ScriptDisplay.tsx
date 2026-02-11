'use client';

import type { ScriptBlock as ScriptBlockType } from '@/types';
import { ScriptBlock } from './ScriptBlock';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { ScrollText } from 'lucide-react';

interface ScriptDisplayProps {
  blocks: ScriptBlockType[];
  onEditBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

export function ScriptDisplay({ blocks, onEditBlock, onDeleteBlock }: ScriptDisplayProps) {
  const scrollRef = useAutoScroll(blocks.length);

  if (blocks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted mb-4">
          <ScrollText size={32} className="text-accent" />
        </div>
        <p className="text-text-secondary font-medium mb-1">まだ何も書かれていません</p>
        <p className="text-text-muted text-sm">下のボタンから柱・セリフ・ト書きを追加</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="py-2">
        {blocks.map((block) => (
          <ScriptBlock
            key={block.id}
            block={block}
            onEdit={() => onEditBlock(block.id)}
            onDelete={() => onDeleteBlock(block.id)}
          />
        ))}
      </div>
    </div>
  );
}
