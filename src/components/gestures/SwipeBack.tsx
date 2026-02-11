'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRef, useCallback, useEffect } from 'react';
import { useNavigationStore } from '@/stores/useNavigationStore';

const EDGE_WIDTH = 24; // px from left edge to start swipe
const THRESHOLD = 80; // px to trigger back
const VELOCITY_THRESHOLD = 400; // px/s to trigger back

// Pages with no parent to go back to
const ROOT_PATHS = ['/projects', '/editor', '/notes'];

export function SwipeBack({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setDirection = useNavigationStore((s) => s.setDirection);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);
  const isTracking = useRef(false);
  const isHorizontal = useRef<boolean | null>(null);

  const isRootPage = ROOT_PATHS.includes(pathname);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isRootPage) return;
      const touch = e.touches[0];
      if (touch.clientX > EDGE_WIDTH) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      currentX.current = 0;
      startTime.current = Date.now();
      isTracking.current = true;
      isHorizontal.current = null;
    },
    [isRootPage]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isTracking.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      // Determine direction on first significant move
      if (isHorizontal.current === null) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          isHorizontal.current = Math.abs(dx) > Math.abs(dy);
          if (!isHorizontal.current) {
            isTracking.current = false;
            return;
          }
        } else {
          return;
        }
      }

      if (dx < 0) return; // Only track rightward swipe
      currentX.current = dx;

      const el = containerRef.current;
      if (el) {
        const progress = Math.min(dx / window.innerWidth, 1);
        el.style.transform = `translateX(${dx}px)`;
        el.style.opacity = String(1 - progress * 0.3);
        el.style.transition = 'none';
      }
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (!isTracking.current) return;
    isTracking.current = false;

    const el = containerRef.current;
    if (!el) return;

    const dx = currentX.current;
    const dt = (Date.now() - startTime.current) / 1000;
    const velocity = dx / dt;

    if (dx > THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      // Animate out then navigate back
      el.style.transition = 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), opacity 0.25s ease';
      el.style.transform = `translateX(${window.innerWidth}px)`;
      el.style.opacity = '0';
      setTimeout(() => {
        setDirection('back');
        router.back();
      }, 200);
    } else {
      // Snap back
      el.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.0), opacity 0.3s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
  }, [router, setDirection]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Reset transform when pathname changes
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.style.transform = '';
      el.style.opacity = '';
      el.style.transition = '';
    }
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
