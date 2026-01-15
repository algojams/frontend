import { create } from 'zustand';
import type { Strudel } from '@/lib/api/strudels/types';

interface PlayerState {
  currentStrudel: Strudel | null;
  isPlaying: boolean;
  isLoading: boolean;
  shouldResume: boolean;
  shouldStop: boolean;

  setCurrentStrudel: (strudel: Strudel | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setShouldResume: (resume: boolean) => void;
  setShouldStop: (stop: boolean) => void;
  play: (strudel: Strudel) => void;
  resume: () => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentStrudel: null,
  isPlaying: false,
  isLoading: false,
  shouldResume: false,
  shouldStop: false,

  setCurrentStrudel: currentStrudel => set({ currentStrudel }),
  setIsPlaying: isPlaying => set({ isPlaying }),
  setIsLoading: isLoading => set({ isLoading }),
  setShouldResume: shouldResume => set({ shouldResume }),
  setShouldStop: shouldStop => set({ shouldStop }),

  play: strudel => {
    const { currentStrudel } = get();
    // If same strudel is already loaded, just resume
    if (currentStrudel?.id === strudel.id) {
      set({ shouldResume: true, shouldStop: false });
    } else {
      // Load new strudel
      set({ currentStrudel: strudel, isLoading: true, shouldResume: false, shouldStop: false });
    }
  },
  resume: () => set({ shouldResume: true, shouldStop: false }),
  stop: () => set({ shouldStop: true, shouldResume: false }),
}));
