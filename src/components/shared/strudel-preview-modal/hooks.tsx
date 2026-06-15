'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Strudel } from '@/lib/types/strudel';
import { useShareStrudel } from '@/lib/hooks/use-share-strudel';
import { useEditorStore } from '@/lib/stores/editor';
import { useUIStore } from '@/lib/stores/ui';
import { EDITOR } from '@/lib/constants';
import { getAnonDisplayName } from '@/components/shared/settings-modal/hooks';

export function useStrudelPreviewModal(
  strudel: Strudel | null,
  onOpenChange: (open: boolean) => void
) {
  const router = useRouter();
  const { isDirty, code, currentStrudelId } = useEditorStore();
  const { setPendingForkId } = useUIStore();
  const { copyShareLink } = useShareStrudel();
  const [error, setError] = useState<string | null>(null);

  const handleErrorChange = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const handleFork = useCallback(() => {
    const hasUnsavedChanges = isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);

    onOpenChange(false);

    if (hasUnsavedChanges) {
      setPendingForkId(strudel?.id ?? '');
    } else {
      router.push(`/?fork=${strudel?.id}`);
    }
  }, [isDirty, currentStrudelId, code, onOpenChange, setPendingForkId, strudel?.id, router]);

  const handleShare = useCallback(() => {
    if (!strudel) return;

    void copyShareLink({
      code: strudel.code,
      title: strudel.title,
      license: strudel.license,
      author: getAnonDisplayName() || undefined,
      ccSignal: strudel.cc_signal ?? strudel.parent_cc_signal ?? null,
    });
  }, [copyShareLink, strudel]);

  return {
    error,
    handleErrorChange,
    handleFork,
    handleShare,
  };
}
