'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStrudelAudio } from '@/lib/hooks/use-strudel-audio';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { useAgentGenerate } from '@/lib/hooks/use-agent';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { storage } from '@/lib/utils/storage';
import { formatCode } from '@/lib/utils/format';

interface UseEditorOptions {
  strudelId?: string | null;
  forkStrudelId?: string | null;
}

export const useEditor = ({ strudelId, forkStrudelId }: UseEditorOptions = {}) => {
  const router = useRouter();
  const agentGenerate = useAgentGenerate();
  const { evaluate, stop } = useStrudelAudio();
  const { saveStatus, handleSave, handleRestore, hasRestorableVersion } = useAutosave();
  const { isChatPanelOpen, toggleChatPanel, setNewStrudelDialogOpen } = useUIStore();
  const {
    code,
    setCode,
    setCurrentStrudel,
    setCurrentDraftId,
    setForkedFromId,
    setParentCCSignal,
    currentStrudelTitle,
    markSaved,
    setConversationHistory,
  } = useEditorStore();

  const [isFormatting, setIsFormatting] = useState(false);
  const [isLoadingStrudel, setIsLoadingStrudel] = useState(false);

  useEffect(() => {
    if (currentStrudelTitle) {
      document.title = `${currentStrudelTitle} | Algopatterns`;
    } else {
      document.title = 'Algopatterns';
    }
  }, [currentStrudelTitle]);

  const loadedStrudelIdRef = useRef<string | null>(null);
  const forkedStrudelIdRef = useRef<string | null>(null);
  const previousStrudelIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const currentId = strudelId || null;
    const previousId = previousStrudelIdRef.current;

    if (previousId === undefined) {
      previousStrudelIdRef.current = currentId;
      return;
    }

    if (currentId !== previousId) {
      previousStrudelIdRef.current = currentId;
      setConversationHistory([]);
    }
  }, [strudelId, setConversationHistory]);

  useEffect(() => {
    if (strudelId || forkStrudelId) {
      return;
    }

    const storedStrudelId = storage.getCurrentStrudelId();
    if (storedStrudelId) {
      router.replace(`/?id=${storedStrudelId}`, { scroll: false });
    }
  }, [strudelId, forkStrudelId, router]);

  useEffect(() => {
    if (!strudelId) {
      if (loadedStrudelIdRef.current) {
        loadedStrudelIdRef.current = null;
      }
      setIsLoadingStrudel(false);
      return;
    }

    if (loadedStrudelIdRef.current === strudelId) {
      return;
    }

    setIsLoadingStrudel(true);
    const localStrudel = storage.getLocalStrudel(strudelId);

    if (!localStrudel) {
      toast.error('Strudel not found');
      router.replace('/');
      setIsLoadingStrudel(false);
      return;
    }

    loadedStrudelIdRef.current = strudelId;
    setCode(localStrudel.code, true);
    setConversationHistory(localStrudel.conversation_history || []);
    setCurrentStrudel(localStrudel.id, localStrudel.title);

    if (localStrudel.forked_from) {
      setForkedFromId(localStrudel.forked_from);
      setParentCCSignal(localStrudel.parent_cc_signal ?? null);
    }

    markSaved();
    setIsLoadingStrudel(false);
  }, [
    strudelId,
    router,
    setCode,
    setConversationHistory,
    setCurrentStrudel,
    setForkedFromId,
    setParentCCSignal,
    markSaved,
  ]);

  useEffect(() => {
    if (!forkStrudelId || strudelId) {
      return;
    }

    if (forkedStrudelIdRef.current === forkStrudelId) {
      return;
    }

    const source = storage.getLocalStrudel(forkStrudelId);
    if (!source) {
      toast.error('Strudel not found');
      router.replace('/');
      return;
    }

    forkedStrudelIdRef.current = forkStrudelId;
    const forkDraftId = `fork_${forkStrudelId}`;

    setCurrentStrudel(null, null);
    setCurrentDraftId(forkDraftId);
    setForkedFromId(forkStrudelId);
    setParentCCSignal(source.cc_signal ?? null);
    setCode(source.code, true);
    setConversationHistory([]);

    storage.setDraft({
      id: forkDraftId,
      code: source.code,
      conversationHistory: [],
      updatedAt: Date.now(),
      title: `Fork of ${source.title}`,
      forkedFromId: forkStrudelId,
      parentCCSignal: source.cc_signal ?? null,
    });

    router.replace('/', { scroll: false });
    toast.success(`Forked "${source.title}" - save to create your own copy`);
  }, [
    forkStrudelId,
    strudelId,
    router,
    setCode,
    setCurrentStrudel,
    setCurrentDraftId,
    setForkedFromId,
    setParentCCSignal,
    setConversationHistory,
  ]);

  const handlePlay = useCallback(() => {
    evaluate();
  }, [evaluate]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleUpdate = useCallback(() => {
    evaluate();
  }, [evaluate]);

  const handleCodeChange = useCallback(() => {
    // local editor store handles code updates
  }, []);

  const handleSendAIRequest = useCallback(
    (query: string) => agentGenerate.mutate(query),
    [agentGenerate]
  );

  const handleNewStrudel = useCallback(() => {
    setNewStrudelDialogOpen(true);
  }, [setNewStrudelDialogOpen]);

  const handleFormat = useCallback(async () => {
    if (isFormatting) return;

    setIsFormatting(true);
    try {
      const formatted = await formatCode(code);
      if (formatted !== code) {
        useEditorStore.getState().setNextUpdateSource('typed');
        setCode(formatted, false);
        toast.success('Code formatted');
      }
    } catch (error) {
      toast.error('Failed to format code');
      console.error('Format error:', error);
    } finally {
      setIsFormatting(false);
    }
  }, [code, isFormatting, setCode]);

  return {
    handleCodeChange,
    handlePlay,
    handleStop,
    handleUpdate,
    handleSendAIRequest,
    handleSave,
    handleRestore,
    handleNewStrudel,
    handleFormat,
    isChatPanelOpen,
    toggleChatPanel,
    saveStatus,
    hasRestorableVersion,
    isLoadingStrudel,
    isFormatting,
  };
};
