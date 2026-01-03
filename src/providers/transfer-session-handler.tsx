'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';
import { storage } from '@/lib/utils/storage';

export function TransferSessionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setTransferDialogOpen } = useUIStore();
  const { token } = useAuthStore();

  useEffect(() => {
    const transferSession = searchParams.get('transfer_session');

    if (transferSession && token) {
      // Open the transfer dialog
      setTransferDialogOpen(true);

      // Remove the query param from the URL without triggering a navigation
      const params = new URLSearchParams(searchParams.toString());
      params.delete('transfer_session');
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, token, setTransferDialogOpen, router, pathname]);

  return null;
}
