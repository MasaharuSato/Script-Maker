'use client';

import { Children, type ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}

export function AnimatedList({ children, className = 'flex flex-col gap-3', staggerMs = 50 }: AnimatedListProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => (
        <div
          className="animate-card-enter"
          style={{ animationDelay: `${i * staggerMs}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
