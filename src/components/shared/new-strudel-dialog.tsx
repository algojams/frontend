"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui";
import { useAuthStore } from "@/lib/stores/auth";
import { useEditorStore } from "@/lib/stores/editor";
import { wsClient } from "@/lib/websocket/client";
import { storage } from "@/lib/utils/storage";
import { EDITOR } from "@/lib/constants";

export function NewStrudelDialog() {
  const {
    isNewStrudelDialogOpen,
    setNewStrudelDialogOpen,
    setLoginModalOpen,
    setSaveStrudelDialogOpen,
  } = useUIStore();
  const { token } = useAuthStore();
  const { isDirty, currentStrudelId, setCode, setCurrentStrudel, clearHistory } = useEditorStore();

  const isAuthenticated = !!token;
  const hasUnsavedStrudel = isDirty && !currentStrudelId; // Has changes but never saved

  const handleClose = () => {
    setNewStrudelDialogOpen(false);
  };

  const handleLogin = () => {
    setNewStrudelDialogOpen(false);
    setLoginModalOpen(true);
  };

  const handleClearEditor = () => {
    setCode(EDITOR.DEFAULT_CODE, true);
    setCurrentStrudel(null, null);
    clearHistory();
    wsClient.sendCodeUpdate(EDITOR.DEFAULT_CODE);
    setNewStrudelDialogOpen(false);
  };

  const handleSaveFirst = () => {
    // Close this dialog and open save dialog
    setNewStrudelDialogOpen(false);
    setSaveStrudelDialogOpen(true);
  };

  const handleStartNew = () => {
    // Clear storage and disconnect
    storage.clearSessionId();
    wsClient.disconnect();

    // Reset editor state
    setCode(EDITOR.DEFAULT_CODE, true);
    setCurrentStrudel(null, null);
    clearHistory();

    // Reconnect to get a fresh session
    wsClient.connect();

    setNewStrudelDialogOpen(false);
  };

  // Anonymous user view
  if (!isAuthenticated) {
    return (
      <Dialog open={isNewStrudelDialogOpen} onOpenChange={setNewStrudelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a New Strudel</DialogTitle>
            <DialogDescription>
              Sign in to save your strudels and access them later. As a guest,
              you can clear the editor to start fresh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleClearEditor}>
              Clear Editor
            </Button>
            <Button onClick={handleLogin}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Authenticated user view
  return (
    <Dialog open={isNewStrudelDialogOpen} onOpenChange={setNewStrudelDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a New Strudel</DialogTitle>
          <DialogDescription>
            {hasUnsavedStrudel
              ? "You have unsaved changes. Would you like to save your current work before starting a new strudel?"
              : "Start fresh with a new strudel session."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {hasUnsavedStrudel ? (
            <>
              <Button variant="outline" onClick={handleStartNew}>
                Discard & Start New
              </Button>
              <Button onClick={handleSaveFirst}>Save First</Button>
            </>
          ) : (
            <Button onClick={handleStartNew}>Start New</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
