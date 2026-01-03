'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStrudels } from '@/lib/hooks/use-strudels';
import { useUIStore } from '@/lib/stores/ui';

export const useDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useStrudels();
  const { setTransferDialogOpen } = useUIStore();

  useEffect(() => {
    const transferSession = searchParams.get('transfer_session');

    if (transferSession) {
      setTransferDialogOpen(true);
    }
  }, [searchParams, setTransferDialogOpen]);

  return { data, isLoading, setTransferDialogOpen, router };
};
