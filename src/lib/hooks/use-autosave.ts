'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/lib/stores/editor';
import { useUIStore } from '@/lib/stores/ui';
import { storage, type GoodVersion } from '@/lib/utils/storage';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

const AUTOSAVE_DEBOUNCE_MS = 10000;

function isLocalStrudelId(id: string | null): boolean {
  return !!id && id.startsWith('local_');
}

export function useAutosave() {
  const { isDirty, code, conversationHistory, currentStrudelId, markSaved, setCode } =
    useEditorStore();
  const { setSaveStrudelDialogOpen } = useUIStore();
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasStrudel = !!currentStrudelId;
  const isLocalStrudel = isLocalStrudelId(currentStrudelId);

  const getSaveStatus = useCallback((): SaveStatus => {
    if (isSaving) return 'saving';
    if (!hasStrudel) return 'unsaved';
    if (isDirty) return 'unsaved';
    return 'saved';
  }, [isSaving, hasStrudel, isDirty]);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>(getSaveStatus);

  useEffect(() => {
    setSaveStatus(getSaveStatus());
  }, [getSaveStatus]);

  useEffect(() => {
    if (!currentStrudelId || !code) return;

    const existingGoodVersion = storage.getGoodVersion(currentStrudelId);
    if (!existingGoodVersion) {
      storage.setGoodVersion(currentStrudelId, code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStrudelId]);

  useEffect(() => {
    if (!isLocalStrudel || !isDirty || !currentStrudelId) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      try {
        const existingStrudel = storage.getLocalStrudel(currentStrudelId);
        if (existingStrudel) {
          storage.setLocalStrudel({
            ...existingStrudel,
            code,
            conversation_history: conversationHistory.map(h => ({
              role: h.role as 'user' | 'assistant',
              content: h.content,
              is_actionable: h.is_actionable,
              is_code_response: h.is_code_response,
              clarifying_questions: h.clarifying_questions,
              strudel_references: h.strudel_references,
              doc_references: h.doc_references,
            })),
            updated_at: new Date().toISOString(),
          });
          markSaved();
        }
      } catch (error) {
        console.error('Local autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isLocalStrudel, isDirty, currentStrudelId, code, conversationHistory, markSaved]);

  const handleSave = useCallback(async () => {
    if (!hasStrudel) {
      setSaveStrudelDialogOpen(true);
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    try {
      const existingStrudel = storage.getLocalStrudel(currentStrudelId!);
      if (existingStrudel) {
        storage.setLocalStrudel({
          ...existingStrudel,
          code,
          conversation_history: conversationHistory.map(h => ({
            role: h.role as 'user' | 'assistant',
            content: h.content,
            is_actionable: h.is_actionable,
            is_code_response: h.is_code_response,
            clarifying_questions: h.clarifying_questions,
            strudel_references: h.strudel_references,
            doc_references: h.doc_references,
          })),
          updated_at: new Date().toISOString(),
        });
        storage.setGoodVersion(currentStrudelId!, code);
        markSaved();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasStrudel, currentStrudelId, code, conversationHistory, setSaveStrudelDialogOpen, markSaved]);

  const getGoodVersion = useCallback((): GoodVersion | null => {
    if (!currentStrudelId) return null;
    return storage.getGoodVersion(currentStrudelId);
  }, [currentStrudelId]);

  const hasRestorableVersion = useCallback((): boolean => {
    const goodVersion = getGoodVersion();
    return goodVersion !== null && goodVersion.code !== code;
  }, [getGoodVersion, code]);

  const handleRestore = useCallback(() => {
    const goodVersion = getGoodVersion();
    if (goodVersion) {
      setCode(goodVersion.code);
    }
  }, [getGoodVersion, setCode]);

  return {
    saveStatus,
    handleSave,
    handleRestore,
    hasStrudel,
    getGoodVersion,
    hasRestorableVersion,
  };
}
