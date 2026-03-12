'use client';

import { useState } from 'react';
import { ClipboardCopy, FileText, Printer } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { formatScript } from '@/utils/formatScript';
import type { ScriptBlock } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: ScriptBlock[];
  title?: string;
}

export function ExportModal({ isOpen, onClose, blocks, title }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = formatScript(blocks, title);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = formatScript(blocks, title);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '無題の脚本'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    const text = formatScript(blocks, title);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title || '無題の脚本'}</title>
<style>
  @page { margin: 20mm; }
  body {
    font-family: "Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif;
    font-size: 12pt;
    line-height: 1.8;
    color: #000;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
</head>
<body>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="エクスポート">
      <div className="flex flex-col gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-4 text-left hover:bg-bg-elevated transition-colors active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-muted">
            <ClipboardCopy size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary">クリップボードにコピー</p>
            <p className="text-sm text-text-muted">テキストとしてコピー</p>
          </div>
          {copied && (
            <span className="text-sm font-medium text-accent">コピーしました</span>
          )}
        </button>

        <button
          onClick={handleDownloadTxt}
          className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-4 text-left hover:bg-bg-elevated transition-colors active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-muted">
            <FileText size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary">TXTでダウンロード</p>
            <p className="text-sm text-text-muted">.txt ファイルとして保存</p>
          </div>
        </button>

        <button
          onClick={handlePrintPdf}
          className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-4 text-left hover:bg-bg-elevated transition-colors active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-muted">
            <Printer size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary">PDFで保存</p>
            <p className="text-sm text-text-muted">印刷ダイアログから保存</p>
          </div>
        </button>
      </div>
    </Modal>
  );
}
