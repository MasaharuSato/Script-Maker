'use client';

import { motion } from 'framer-motion';
import { useNavigationStore } from '@/stores/useNavigationStore';

const variants = {
  forward: {
    initial: { x: '25%', opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1 },
  },
  back: {
    initial: { x: '-25%', opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1 },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  const { direction, resetDirection } = useNavigationStore();
  const v = variants[direction];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 34,
        mass: 0.8,
      }}
      onAnimationComplete={resetDirection}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
