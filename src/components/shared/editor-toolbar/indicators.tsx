'use client';

import { Cloud, Loader2, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { SaveStatus } from './hooks';
import type { AudioEngineStatus } from '@/lib/hooks/use-audio-engine-status';

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving') {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (status === 'unsaved') {
    return <Cloud className="h-4 w-4 text-yellow-500" />;
  }

  return <Cloud className="h-4 w-4 text-green-500 save-indicator-saved" />;
}

const AUDIO_ENGINE_CONFIG: Record<
  AudioEngineStatus,
  { className: string; pulse?: boolean }
> = {
  ready: {
    className: 'text-muted-foreground',
  },
  playing: {
    className: 'text-emerald-500',
    pulse: true,
  },
  suspended: {
    className: 'text-amber-500',
  },
  error: {
    className: 'text-red-500',
  },
};

export function AudioEngineIndicator({
  status,
  label,
}: {
  status: AudioEngineStatus;
  label: string;
}) {
  const { className, pulse } = AUDIO_ENGINE_CONFIG[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className} aria-label={label}>
          <Activity className={`h-3.5 w-3.5 ${pulse ? 'animate-pulse' : ''}`} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
