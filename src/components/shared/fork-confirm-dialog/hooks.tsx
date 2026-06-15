'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { EDITOR } from '@/lib/constants';

export function useForkConfirmDialog() {
  const router = useRouter();
  const { pendingForkId, setPendingForkId, setSaveStrudelDialogOpen } = useUIStore();
  const { isDirty, code, currentStrudelId, currentDraftId } = useEditorStore();

  const hasUnsavedChanges =
    isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);

  const isReforkingSameStrudel =
    pendingForkId && currentDraftId === `fork_${pendingForkId}`;

  const handleClose = () => {
    setPendingForkId(null);
  };

  const handleFork = () => {
    if (pendingForkId) {
      router.push(`/?fork=${pendingForkId}`);
    }
    setPendingForkId(null);
  };

  const handleSaveFirst = () => {
    setSaveStrudelDialogOpen(true);
  };

  return {
    pendingForkId,
    hasUnsavedChanges,
    isReforkingSameStrudel,
    currentStrudelId,
    handleClose,
    handleFork,
    handleSaveFirst,
  };
}
