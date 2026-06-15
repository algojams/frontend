'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { storage, type LocalStrudel } from '@/lib/utils/storage';
import type { Strudel } from '@/lib/types/strudel';
import { getAnonDisplayName } from '@/components/shared/settings-modal/hooks';

function localToStrudel(local: LocalStrudel): Strudel {
  const displayName = getAnonDisplayName();
  return {
    ...local,
    user_id: 'local',
    author_name: displayName || undefined,
    categories: [],
    ai_assist_count: 0,
  };
}

export const useDashboard = () => {
  const router = useRouter();
  const [localStrudels, setLocalStrudels] = useState<LocalStrudel[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    setLocalStrudels(storage.getAllLocalStrudels());
    setLocalLoading(false);
  }, []);

  const refreshLocalStrudels = useCallback(() => {
    setLocalStrudels(storage.getAllLocalStrudels());
  }, []);

  const strudels = useMemo(() => localStrudels.map(localToStrudel), [localStrudels]);

  return {
    strudels,
    total: localStrudels.length,
    isLoading: localLoading,
    isFetchingNextPage: false,
    loadMoreRef: useCallback(() => {}, []),
    router,
    refreshLocalStrudels,
  };
};
