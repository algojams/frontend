'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import type { CCSignal, CCLicense } from '@/lib/types/strudel';
import { buildShareUrl, type SharePayload } from '@/lib/utils/share-url';

interface ShareStrudelOptions {
  code: string;
  title?: string | null;
  license?: CCLicense | null;
  author?: string | null;
  ccSignal?: CCSignal | null;
}

export function useShareStrudel() {
  const copyShareLink = useCallback(async (options: ShareStrudelOptions) => {
    const payload: SharePayload = {
      c: options.code,
      ...(options.title ? { t: options.title } : {}),
      ...(options.license ? { l: options.license } : {}),
      ...(options.author ? { a: options.author } : {}),
      ...(options.ccSignal ? { p: options.ccSignal } : {}),
    };

    const result = buildShareUrl(payload);

    if ('error' in result) {
      if (result.error === 'too_large') {
        toast.error('Pattern is too large to share via link. Save it locally or export the file instead.');
      } else {
        toast.error('Nothing to share yet');
      }
      return false;
    }

    try {
      await navigator.clipboard.writeText(result.url);
      toast.success('Share link copied to clipboard');
      return true;
    } catch {
      toast.error('Could not copy link to clipboard');
      return false;
    }
  }, []);

  return { copyShareLink };
}
