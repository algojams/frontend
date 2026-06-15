'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useForkConfirmDialog } from './hooks';

export function ForkConfirmDialog() {
  const {
    pendingForkId,
    hasUnsavedChanges,
    isReforkingSameStrudel,
    currentStrudelId,
    handleClose,
    handleFork,
    handleSaveFirst,
  } = useForkConfirmDialog();

  if (!pendingForkId) {
    return null;
  }

  const title = isReforkingSameStrudel ? 'Re-fork Strudel' : hasUnsavedChanges ? 'Unsaved Changes' : 'Fork Strudel';
  const description = isReforkingSameStrudel
    ? 'Your changes to this fork will be overwritten with the original.'
    : hasUnsavedChanges
    ? currentStrudelId
      ? "You have unsaved changes. Your current work will be saved as a draft."
      : 'Your current work will be saved as a draft so you can continue later.'
    : 'Create a copy of this strudel to edit.';

  return (
    <AlertDialog open={!!pendingForkId} onOpenChange={open => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          {hasUnsavedChanges ? (
            <>
              <AlertDialogCancel onClick={handleFork}>
                {isReforkingSameStrudel ? 'Overwrite & Re-fork' : 'Fork Anyway'}
              </AlertDialogCancel>
              {!currentStrudelId && <AlertDialogAction onClick={handleSaveFirst}>Save First</AlertDialogAction>}
            </>
          ) : (
            <AlertDialogAction onClick={handleFork}>Fork</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
