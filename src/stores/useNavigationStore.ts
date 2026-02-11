'use client';

import { create } from 'zustand';

type Direction = 'forward' | 'back';

interface NavigationState {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  resetDirection: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  direction: 'forward',
  setDirection: (direction) => set({ direction }),
  resetDirection: () => set({ direction: 'forward' }),
}));
