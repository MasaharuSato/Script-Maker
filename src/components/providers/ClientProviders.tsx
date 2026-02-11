'use client';

import { SwipeBack } from '@/components/gestures/SwipeBack';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <SwipeBack>{children}</SwipeBack>;
}
