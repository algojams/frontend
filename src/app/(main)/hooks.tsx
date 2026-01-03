'use client';

import { useCallback } from 'react';
import { useStrudelAudio } from '@/lib/hooks/use-strudel-audio';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';

export const useEditor = () => {
  const { token } = useAuthStore();
  const { evaluate, stop } = useStrudelAudio();
  const { isChatPanelOpen, toggleChatPanel, setNewStrudelDialogOpen } = useUIStore();
  const { sendCode, sendAgentRequest, sendChatMessage, isConnected, canEdit, sessionId } =
    useWebSocket({
      autoConnect: true,
    });
  const { saveStatus, handleSave, isAuthenticated } = useAutosave();

  const handlePlay = useCallback(() => evaluate(), [evaluate]);
  const handleStop = useCallback(() => stop(), [stop]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (isConnected && canEdit) {
        sendCode(newCode);
      }
    },
    [isConnected, canEdit, sendCode]
  );

  const handleSendAIRequest = useCallback(
    (query: string) => sendAgentRequest(query),
    [sendAgentRequest]
  );

  const handleSendMessage = useCallback(
    (message: string) => sendChatMessage(message),
    [sendChatMessage]
  );

  const handleNewStrudel = useCallback(() => {
    setNewStrudelDialogOpen(true);
  }, [setNewStrudelDialogOpen]);

  return {
    handleCodeChange,
    handlePlay,
    handleStop,
    handleSendAIRequest,
    handleSendMessage,
    handleSave,
    handleNewStrudel,
    isChatPanelOpen,
    toggleChatPanel,
    isConnected,
    canEdit,
    sessionId,
    token,
    saveStatus,
    isAuthenticated,
  };
};
