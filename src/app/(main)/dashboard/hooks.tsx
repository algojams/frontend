'use client';

import { useRouter } from 'next/navigation';
import { useStrudels } from '@/lib/hooks/use-strudels';

export const useDashboard = () => {
  const router = useRouter();
  const { data, isLoading } = useStrudels();

  return { data, isLoading, router };
};
