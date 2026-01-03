'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStrudelAudio } from '@/lib/hooks/use-strudel-audio';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { useStrudel, usePublicStrudel } from '@/lib/hooks/use-strudels';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';
import { useEditorStore } from '@/lib/stores/editor';
import { wsClient } from '@/lib/websocket/client';

interface UseEditorOptions {
  strudelId?: string | null;
  forkStrudelId?: string | null;
}

export const useEditor = ({ strudelId, forkStrudelId }: UseEditorOptions = {}) => {
  const router = useRouter();
  const { token } = useAuthStore();
  const { setCode, setCurrentStrudel, currentStrudelId } = useEditorStore();
  const { evaluate, stop } = useStrudelAudio();
  const { isChatPanelOpen, toggleChatPanel, setNewStrudelDialogOpen } = useUIStore();
  const { sendCode, sendAgentRequest, sendChatMessage, isConnected, canEdit, sessionId } =
    useWebSocket({
      autoConnect: true,
    });
  const { saveStatus, handleSave, isAuthenticated } = useAutosave();

  // Track if we've already loaded this strudel to prevent re-fetching
  const loadedStrudelIdRef = useRef<string | null>(null);
  const forkedStrudelIdRef = useRef<string | null>(null);


  // Fetch strudel for edit mode (requires auth - user's own strudel)
  const {
    data: ownStrudel,
    isLoading: isLoadingOwnStrudel,
    error: ownStrudelError,
  } = useStrudel(strudelId || '');

  // Fetch strudel for fork mode (public endpoint - no auth required)
  const {
    data: publicStrudel,
    isLoading: isLoadingPublicStrudel,
    error: publicStrudelError,
  } = usePublicStrudel(forkStrudelId || '');

  const isLoadingStrudel = isLoadingOwnStrudel || isLoadingPublicStrudel;

  // Handle strudel loading (edit mode)
  useEffect(() => {
    if (!strudelId) {
      // No strudel ID - reset if we had one before
      if (loadedStrudelIdRef.current) {
        loadedStrudelIdRef.current = null;
      }
      return;
    }

    // Handle errors
    if (ownStrudelError) {
      const status = (ownStrudelError as { status?: number })?.status;
      if (status === 404) {
        toast.error('Strudel not found');
      } else if (status === 403) {
        toast.error("You don't have access to this strudel");
      } else {
        toast.error('Failed to load strudel');
      }
      router.replace('/');
      return;
    }

    // Load strudel data once fetched
    if (ownStrudel && loadedStrudelIdRef.current !== strudelId) {
      loadedStrudelIdRef.current = strudelId;
      setCurrentStrudel(ownStrudel.id, ownStrudel.title);
      setCode(ownStrudel.code, true);

      // Sync to WebSocket session once connected
      wsClient.onceConnected(() => {
        wsClient.sendCodeUpdate(ownStrudel.code);
      });
    }
  }, [strudelId, ownStrudel, ownStrudelError, router, setCode, setCurrentStrudel]);

  // Handle fork loading (load code but don't set currentStrudelId)
  useEffect(() => {
    if (!forkStrudelId || strudelId) {
      // Skip if no fork ID or if we're in edit mode
      return;
    }

    // Handle errors
    if (publicStrudelError) {
      const status = (publicStrudelError as { status?: number })?.status;
      if (status === 404) {
        toast.error('Strudel not found');
      } else {
        toast.error('Failed to load strudel');
      }
      router.replace('/');
      return;
    }

    // Load code only (not as owner) - saving will create new strudel
    if (publicStrudel && forkedStrudelIdRef.current !== forkStrudelId) {
      forkedStrudelIdRef.current = forkStrudelId;
      setCurrentStrudel(null, null); // Don't set as owner
      setCode(publicStrudel.code, true);

      // Clear fork param from URL
      router.replace('/', { scroll: false });

      toast.success(`Forked "${publicStrudel.title}" - save to create your own copy`);

      // Sync to WebSocket session once connected
      wsClient.onceConnected(() => {
        wsClient.sendCodeUpdate(publicStrudel.code);
      });
    }
  }, [forkStrudelId, strudelId, publicStrudel, publicStrudelError, router, setCode, setCurrentStrudel]);

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
    isLoadingStrudel,
    currentStrudelId,
  };
};
