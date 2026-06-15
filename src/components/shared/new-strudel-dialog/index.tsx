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
import { useNewStrudelDialog } from './hooks';

export function NewStrudelDialog() {
  const {
    isNewStrudelDialogOpen,
    setNewStrudelDialogOpen,
    hasUnsavedChanges,
    currentStrudelId,
    handleClose,
    handleClearEditor,
    handleSaveFirst,
    handleStartNew,
  } = useNewStrudelDialog();

  return (
    <AlertDialog open={isNewStrudelDialogOpen} onOpenChange={setNewStrudelDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start a New Strudel</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          {hasUnsavedChanges
            ? currentStrudelId
              ? "You have unsaved changes. Save first or start fresh — your current work stays in drafts."
              : 'Your current work will be saved as a draft so you can continue later.'
            : 'Start fresh with a new strudel.'}
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogCancel onClick={handleClearEditor}>Clear Editor</AlertDialogCancel>
          {hasUnsavedChanges ? (
            <>
              <AlertDialogCancel onClick={handleStartNew}>Start New</AlertDialogCancel>
              {!currentStrudelId && <AlertDialogAction onClick={handleSaveFirst}>Save First</AlertDialogAction>}
            </>
          ) : (
            <AlertDialogAction onClick={handleStartNew}>Start New</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
