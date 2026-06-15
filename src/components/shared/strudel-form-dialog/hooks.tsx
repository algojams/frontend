'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/stores/editor';
import { useUIStore } from '@/lib/stores/ui';
import { storage } from '@/lib/utils/storage';
import type { Strudel, CCSignal, CCLicense } from '@/lib/api/strudels/types';
import { SIGNAL_RESTRICTIVENESS, inferSignalFromLicense } from '@/lib/api/strudels/types';

export function useStrudelForm(
  strudel: Strudel | null | undefined,
  mode: 'create' | 'edit',
  onClose: () => void
) {
  const router = useRouter();
  const [localSaving, setLocalSaving] = useState(false);

  const {
    code,
    conversationHistory: editorConversationHistory,
    currentDraftId,
    forkedFromId,
    parentCCSignal,
    setCurrentStrudel,
    setCurrentDraftId,
    markSaved,
  } = useEditorStore();

  const conversationHistory = mode === 'edit' && strudel?.conversation_history?.length
    ? strudel.conversation_history
    : editorConversationHistory;
  const hasAIAssistance = conversationHistory.some(msg => msg.is_code_response);
  const defaultSignal: CCSignal = hasAIAssistance ? 'cc-cr' : 'no-ai';

  const {
    pendingForkId,
    setPendingForkId,
    pendingOpenStrudelId,
    setPendingOpenStrudelId,
  } = useUIStore();

  const [title, setTitle] = useState(mode === 'edit' && strudel ? strudel.title : '');
  const [description, setDescription] = useState(
    mode === 'edit' && strudel ? strudel.description || '' : ''
  );
  const [tags, setTags] = useState(
    mode === 'edit' && strudel ? strudel.tags?.join(', ') || '' : ''
  );
  const [license, setLicense] = useState<CCLicense | null>(
    mode === 'edit' && strudel ? strudel.license ?? null : null
  );
  const [ccSignal, setCCSignal] = useState<CCSignal | null>(
    mode === 'edit' && strudel ? strudel.cc_signal ?? null : null
  );
  const [signalOverridden, setSignalOverridden] = useState(false);
  const [error, setError] = useState('');

  const handleLicenseChange = (newLicense: CCLicense | null) => {
    setLicense(newLicense);
    if (!signalOverridden) {
      let inferredSignal = inferSignalFromLicense(newLicense);
      if (hasAIAssistance && inferredSignal === 'no-ai') {
        inferredSignal = 'cc-op';
      }
      setCCSignal(inferredSignal);
    }
  };

  const handleSignalChange = (newSignal: CCSignal | null) => {
    setCCSignal(newSignal);
    setSignalOverridden(true);
  };

  const isCreate = mode === 'create';
  const isPending = localSaving;

  const getEffectiveSignal = (): CCSignal => {
    const signal = ccSignal || defaultSignal;
    if (parentCCSignal) {
      const parentLevel = SIGNAL_RESTRICTIVENESS[parentCCSignal];
      const childLevel = SIGNAL_RESTRICTIVENESS[signal];
      if (childLevel < parentLevel) {
        return parentCCSignal;
      }
    }
    return signal;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      license,
      cc_signal: getEffectiveSignal(),
    };

    try {
      setLocalSaving(true);

      if (isCreate) {
        const now = new Date().toISOString();
        const localStrudel = {
          id: storage.generateLocalStrudelId(),
          title: formData.title,
          code,
          description: formData.description || '',
          tags: formData.tags,
          is_public: false,
          license: formData.license,
          cc_signal: formData.cc_signal,
          forked_from: forkedFromId || undefined,
          parent_cc_signal: parentCCSignal,
          conversation_history: conversationHistory.map(h => ({
            role: h.role as 'user' | 'assistant',
            content: h.content,
            is_actionable: h.is_actionable,
            is_code_response: h.is_code_response,
            clarifying_questions: h.clarifying_questions,
            strudel_references: h.strudel_references,
            doc_references: h.doc_references,
          })),
          created_at: now,
          updated_at: now,
        };

        storage.setLocalStrudel(localStrudel);

        if (currentDraftId) {
          storage.deleteDraft(currentDraftId);
          setCurrentDraftId(null);
        }

        setCurrentStrudel(localStrudel.id, localStrudel.title);
        markSaved();

        if (pendingForkId) {
          setPendingForkId(null);
          router.push(`/?fork=${pendingForkId}`);
        } else if (pendingOpenStrudelId) {
          setPendingOpenStrudelId(null);
          router.push(`/?id=${pendingOpenStrudelId}`);
        } else {
          router.replace(`/?id=${localStrudel.id}`, { scroll: false });
        }
      } else if (strudel) {
        const existing = storage.getLocalStrudel(strudel.id);
        if (existing) {
          storage.setLocalStrudel({
            ...existing,
            title: formData.title,
            description: formData.description || '',
            tags: formData.tags,
            license: formData.license,
            cc_signal: formData.cc_signal,
            updated_at: new Date().toISOString(),
          });
        }
      }

      setLocalSaving(false);
      onClose();
    } catch (err) {
      setLocalSaving(false);
      setError(`Failed to ${isCreate ? 'save' : 'update'} strudel. Please try again.`);
      console.error(`failed to ${isCreate ? 'save' : 'update'} strudel:`, err);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    license,
    handleLicenseChange,
    ccSignal,
    handleSignalChange,
    signalOverridden,
    defaultSignal,
    error,
    setError,
    isCreate,
    isPending,
    parentCCSignal,
    hasAIAssistance,
    isAuthenticated: false,
    handleSave,
  };
}
