'use client';

import { useCallback } from 'react';
import { useStrudelAudio } from '@/lib/hooks/use-strudel-audio';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';

export const useEditor = () => {
  const { token } = useAuthStore();
  const { evaluate, stop } = useStrudelAudio();
  const { isChatPanelOpen, toggleChatPanel } = useUIStore();
  const { sendCode, sendAgentRequest, sendChatMessage, isConnected, canEdit, sessionId } =
    useWebSocket({
      autoConnect: true,
    });

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

  return {
    handleCodeChange,
    handlePlay,
    handleStop,
    handleSendAIRequest,
    handleSendMessage,
    isChatPanelOpen,
    toggleChatPanel,
    isConnected,
    canEdit,
    sessionId,
    token,
  };
};
