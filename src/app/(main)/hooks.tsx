'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useStrudelAudio } from '@/lib/hooks/use-strudel-audio';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { useAgentGenerate } from '@/lib/hooks/use-agent';
import { useShareStrudel } from '@/lib/hooks/use-share-strudel';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { storage } from '@/lib/utils/storage';
import { formatCode } from '@/lib/utils/format';
import type { CCLicense } from '@/lib/types/strudel';
import {
  decodeSharePayload,
  getShareEncodedFromHash,
  hasShareHash,
} from '@/lib/utils/share-url';
import { withStrudelHeader } from '@/lib/utils/strudel-header';
import { getAnonDisplayName } from '@/components/shared/settings-modal/hooks';

interface UseEditorOptions {
  strudelId?: string | null;
  forkStrudelId?: string | null;
}

export const useEditor = ({ strudelId, forkStrudelId }: UseEditorOptions = {}) => {
  const router = useRouter();
  const agentGenerate = useAgentGenerate();
  const { copyShareLink } = useShareStrudel();
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
    currentStrudelId,
    parentCCSignal,
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
  const loadedShareHashRef = useRef<string | null>(null);
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
    if (strudelId || forkStrudelId || hasShareHash()) {
      return;
    }

    const storedStrudelId = storage.getCurrentStrudelId();
    if (storedStrudelId) {
      router.replace(`/?id=${storedStrudelId}`, { scroll: false });
    }
  }, [strudelId, forkStrudelId, router]);

  useEffect(() => {
    if (strudelId || forkStrudelId) {
      return;
    }

    const encoded = getShareEncodedFromHash();
    if (!encoded) {
      loadedShareHashRef.current = null;
      return;
    }

    if (loadedShareHashRef.current === encoded) {
      return;
    }

    const payload = decodeSharePayload(encoded);
    if (!payload) {
      toast.error('Invalid or corrupted share link');
      return;
    }

    loadedShareHashRef.current = encoded;
    storage.clearCurrentStrudelId();
    storage.clearCurrentDraftId();
    setCurrentStrudel(null, payload.t ?? null);
    setCurrentDraftId(null);
    setForkedFromId(null);
    setParentCCSignal(payload.p ?? null);
    setCode(
      withStrudelHeader(payload.c, {
        title: payload.t,
        license: payload.l,
        author: payload.a,
      }),
      true
    );
    setConversationHistory([]);
    markSaved();
  }, [
    strudelId,
    forkStrudelId,
    setCode,
    setConversationHistory,
    setCurrentStrudel,
    setCurrentDraftId,
    setForkedFromId,
    setParentCCSignal,
    markSaved,
  ]);

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
    setCode(
      withStrudelHeader(localStrudel.code, {
        title: localStrudel.title,
        license: localStrudel.license,
        author: getAnonDisplayName(),
      }),
      true
    );
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
    setCode(
      withStrudelHeader(source.code, {
        title: source.title,
        license: source.license,
        author: getAnonDisplayName(),
      }),
      true
    );
    setConversationHistory([]);

    storage.setDraft({
      id: forkDraftId,
      code: withStrudelHeader(source.code, {
        title: source.title,
        license: source.license,
        author: getAnonDisplayName(),
      }),
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

  const handleShare = useCallback(() => {
    let ccSignal = parentCCSignal;
    let license: CCLicense | null | undefined;

    if (currentStrudelId) {
      const localStrudel = storage.getLocalStrudel(currentStrudelId);
      ccSignal = localStrudel?.cc_signal ?? localStrudel?.parent_cc_signal ?? parentCCSignal;
      license = localStrudel?.license;
    }

    void copyShareLink({
      code,
      title: currentStrudelTitle,
      license,
      author: getAnonDisplayName() || undefined,
      ccSignal,
    });
  }, [code, copyShareLink, currentStrudelId, currentStrudelTitle, parentCCSignal]);

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
    handleShare,
    isChatPanelOpen,
    toggleChatPanel,
    saveStatus,
    hasRestorableVersion,
    isLoadingStrudel,
    isFormatting,
  };
};
