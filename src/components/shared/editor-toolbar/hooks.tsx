'use client';

import { useAudioStore } from '@/lib/stores/audio';
import { useAudioEngineStatus } from '@/lib/hooks/use-audio-engine-status';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export function useEditorToolbar() {
  const { isPlaying, isInitialized, isCodeDirty } = useAudioStore();
  const { status, label } = useAudioEngineStatus();

  return {
    isPlaying,
    isInitialized,
    isCodeDirty,
    audioEngineStatus: status,
    audioEngineLabel: label,
  };
}
