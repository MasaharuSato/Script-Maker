import type { ScriptBlock } from '@/types';

/**
 * 脚本ブロック配列を業界標準フォーマットのテキストに変換する
 *
 * - 柱: 〇 + location、前後に空行
 * - セリフ: キャラ名「テキスト」、連続セリフは詰める
 * - ト書き: 全角スペース + テキスト、前後に空行
 */
export function formatScript(blocks: ScriptBlock[], title?: string): string {
  const lines: string[] = [];

  if (title) {
    lines.push(title);
    lines.push('');
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const prev = i > 0 ? blocks[i - 1] : null;

    if (block.type === 'scene_heading') {
      if (i > 0) lines.push('');
      lines.push(`〇${block.location}`);
      lines.push('');
    } else if (block.type === 'dialogue') {
      // 前のブロックがセリフでなければ空行を入れない（柱・ト書きの後は既に空行がある）
      // 前のブロックがセリフなら詰める（空行なし）
      if (prev && prev.type !== 'dialogue' && prev.type !== 'scene_heading') {
        // 前がト書きの場合、既に空行があるのでそのまま
      } else if (prev && prev.type === 'dialogue') {
        // 連続セリフ: 空行なし
      }
      lines.push(`${block.character}「${block.text}」`);
    } else if (block.type === 'action') {
      if (prev && prev.type !== 'scene_heading') {
        lines.push('');
      }
      lines.push(`\u3000${block.text}`);
      lines.push('');
    }
  }

  // 末尾の余分な空行を除去
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}
