'use client';

import { useSyncExternalStore } from 'react';
import { useAudioStore } from '@/lib/stores/audio';
import { isAudioContextSuspended } from '@/components/shared/strudel-editor';

export type AudioEngineStatus = 'ready' | 'playing' | 'suspended' | 'error';

function subscribeToAudioEngine(callback: () => void) {
  const interval = setInterval(callback, 500);
  window.addEventListener('click', callback);
  window.addEventListener('keydown', callback);
  return () => {
    clearInterval(interval);
    window.removeEventListener('click', callback);
    window.removeEventListener('keydown', callback);
  };
}

function getAudioEngineStatus(): AudioEngineStatus {
  const { isPlaying, error, isInitialized, hasPlayGesture } = useAudioStore.getState();

  if (error) return 'error';
  if (isPlaying) return 'playing';
  if (isInitialized && hasPlayGesture && isAudioContextSuspended()) return 'suspended';
  return 'ready';
}

const AUDIO_ENGINE_LABELS: Record<AudioEngineStatus, string> = {
  ready: 'Audio ready',
  playing: 'Playing',
  suspended: 'Audio blocked — click Play again',
  error: 'Pattern error',
};

export function useAudioEngineStatus() {
  const status = useSyncExternalStore(
    subscribeToAudioEngine,
    getAudioEngineStatus,
    () => 'ready' as AudioEngineStatus
  );

  return {
    status,
    label: AUDIO_ENGINE_LABELS[status],
  };
}
