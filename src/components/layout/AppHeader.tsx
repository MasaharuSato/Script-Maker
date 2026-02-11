'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useNavigationStore } from '@/stores/useNavigationStore';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function AppHeader({ title, showBack = false, rightAction }: AppHeaderProps) {
  const router = useRouter();
  const setDirection = useNavigationStore((s) => s.setDirection);

  const handleBack = () => {
    setDirection('back');
    router.back();
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border-light">
      {showBack && (
        <button
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-tertiary active:scale-90 transition-all"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-bold text-text-primary truncate">{title}</h1>
      {rightAction}
    </header>
  );
}
