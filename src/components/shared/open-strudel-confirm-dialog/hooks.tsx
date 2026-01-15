'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { EDITOR } from '@/lib/constants';

export function useOpenStrudelConfirmDialog() {
  const router = useRouter();
  const {
    pendingOpenStrudelId,
    setPendingOpenStrudelId,
    setSaveStrudelDialogOpen,
  } = useUIStore();

  const { isDirty, code, currentStrudelId } = useEditorStore();

  const hasUnsavedChanges =
    isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);


  const handleClose = () => {
    setPendingOpenStrudelId(null);
  };

  const handleOpen = () => {
    if (pendingOpenStrudelId) {
      router.push(`/?id=${pendingOpenStrudelId}`);
    }
    setPendingOpenStrudelId(null);
  };

  const handleSaveFirst = () => {
    setSaveStrudelDialogOpen(true);
  };

  return {
    pendingOpenStrudelId,
    hasUnsavedChanges,
    currentStrudelId,
    handleClose,
    handleOpen,
    handleSaveFirst,
  };
}
