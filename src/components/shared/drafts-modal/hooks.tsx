'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { storage, type Draft } from '@/lib/utils/storage';
import { useUIStore } from '@/lib/stores/ui';
import { useEditorStore } from '@/lib/stores/editor';
import { useAuthStore } from '@/lib/stores/auth';

// Check if a draft is a local backup of a cloud strudel
// Cloud backups use UUID as draft ID, while true drafts start with 'draft_' or 'fork_'
function isCloudBackup(draftId: string): boolean {
  return !draftId.startsWith('draft_') && !draftId.startsWith('fork_');
}

export function useDraftsModal() {
  const router = useRouter();
  const { isDraftsModalOpen, setDraftsModalOpen } = useUIStore();
  const { setCode, setConversationHistory, setForkedFromId, setParentCCSignal } = useEditorStore();
  const { token } = useAuthStore();
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(new Set());

  const isAuthenticated = !!token;

  // load drafts when modal opens, filter out discarded ones
  // for signed-in users, also filter out cloud backups (they can access via shelf)
  const drafts = useMemo(() => {
    if (!isDraftsModalOpen) return [];
    return storage.getAllDrafts().filter(d => {
      if (discardedIds.has(d.id)) return false;
      // hide cloud backups for signed-in users
      if (isAuthenticated && isCloudBackup(d.id)) return false;
      return true;
    });
  }, [isDraftsModalOpen, discardedIds, isAuthenticated]);

  const handleContinue = useCallback((draft: Draft) => {
    // set the draft as current
    storage.setCurrentDraftId(draft.id);

    // load the draft into editor
    setCode(draft.code, true);
    setConversationHistory(draft.conversationHistory || []);

    if (draft.forkedFromId) {
      setForkedFromId(draft.forkedFromId);
      setParentCCSignal(draft.parentCCSignal ?? null);
    }

    setDraftsModalOpen(false);
    router.push('/');
  }, [router, setCode, setConversationHistory, setForkedFromId, setParentCCSignal, setDraftsModalOpen]);

  const handleDiscard = useCallback((draftId: string) => {
    storage.deleteDraft(draftId);
    setDiscardedIds(prev => new Set([...prev, draftId]));
  }, []);

  return {
    isDraftsModalOpen,
    setDraftsModalOpen,
    drafts,
    handleContinue,
    handleDiscard,
  };
}
