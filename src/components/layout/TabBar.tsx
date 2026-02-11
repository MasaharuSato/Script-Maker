'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, PenTool, StickyNote } from 'lucide-react';

const tabs = [
  { href: '/projects', label: 'ファイル', icon: FolderOpen },
  { href: '/editor', label: '起稿', icon: PenTool },
  { href: '/notes', label: 'メモ帳', icon: StickyNote },
] as const;

export function TabBar() {
  const pathname = usePathname();

  const getActive = () => {
    if (pathname.startsWith('/editor')) return '/editor';
    if (pathname.startsWith('/notes')) return '/notes';
    return '/projects';
  };

  const active = getActive();

  return (
    <nav
      className="sticky bottom-0 z-40 flex items-center justify-around bg-bg-secondary/95 backdrop-blur-md border-t border-border-light pb-[var(--safe-area-bottom)]"
      style={{ boxShadow: 'var(--shadow-toolbar)' }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-2.5 transition-colors ${
              isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
