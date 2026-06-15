'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { storage } from '@/lib/utils/storage';
import { EDITOR } from '@/lib/constants';

export function useNewStrudelDialog() {
  const router = useRouter();
  const {
    isNewStrudelDialogOpen,
    setNewStrudelDialogOpen,
    setSaveStrudelDialogOpen,
  } = useUIStore();

  const { isDirty, code, currentStrudelId, setCode, setCurrentStrudel, setCurrentDraftId, clearHistory } =
    useEditorStore();

  const hasUnsavedChanges =
    isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);

  const handleClose = () => {
    setNewStrudelDialogOpen(false);
  };

  const handleClearEditor = () => {
    const newDraftId = storage.generateDraftId();
    setCode(EDITOR.DEFAULT_CODE, true);
    setCurrentStrudel(null, null);
    setCurrentDraftId(newDraftId);
    clearHistory();
    setNewStrudelDialogOpen(false);
  };

  const handleSaveFirst = () => {
    setNewStrudelDialogOpen(false);
    setSaveStrudelDialogOpen(true);
  };

  const handleStartNew = () => {
    const newDraftId = storage.generateDraftId();
    setCode(EDITOR.DEFAULT_CODE, true);
    setCurrentStrudel(null, null);
    setCurrentDraftId(newDraftId);
    clearHistory();
    router.replace('/', { scroll: false });
    setNewStrudelDialogOpen(false);
  };

  return {
    isNewStrudelDialogOpen,
    setNewStrudelDialogOpen,
    hasUnsavedChanges,
    currentStrudelId,
    handleClose,
    handleClearEditor,
    handleSaveFirst,
    handleStartNew,
  };
}
