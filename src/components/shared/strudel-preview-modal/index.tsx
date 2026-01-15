'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  GitFork,
  BotMessageSquare,
  Play,
  Pause,
  Loader2,
  Scale,
  Activity,
} from 'lucide-react';
import type { Strudel } from '@/lib/api/strudels/types';
import { CC_SIGNALS } from '@/lib/api/strudels/types';
import {
  StrudelPreviewPlayer,
  type PlayerState,
} from '@/components/shared/strudel-preview-player';
import { useStrudelPreviewModal } from './hooks';

interface StrudelPreviewModalProps {
  strudel: Strudel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StrudelPreviewModal({
  strudel,
  open,
  onOpenChange,
}: StrudelPreviewModalProps) {
  const { error, handleErrorChange, handleFork } = useStrudelPreviewModal(
    strudel,
    onOpenChange
  );

  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  const handleStateChange = useCallback((state: PlayerState) => {
    setPlayerState(state);
  }, []);

  if (!strudel) return null;

  const isPlaying = playerState?.isPlaying ?? false;
  const isLoading = playerState?.isLoading ?? true;
  const isInitialized = playerState?.isInitialized ?? false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-col gap-4 py-1">
          <DialogTitle className="flex items-center gap-2 text-xl leading-1">
            {strudel.title}
            {strudel.author_name && (
              <span className="text-sm font-normal text-muted-foreground">
                by {strudel.author_name}
              </span>
            )}
          </DialogTitle>

          {(strudel.license || strudel.cc_signal) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {strudel.license && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Scale className="h-4 w-4" />
                  {strudel.license}
                </span>
              )}

              <span className="flex items-center gap-1 text-white/50">
                <Activity className="h-3.5 w-3.5" />
                {strudel.cc_signal?.toUpperCase() || 'NO-AI'} (
                {CC_SIGNALS.find(s => s.id === strudel.cc_signal)?.label ??
                  'AI use not allowed'}
                )
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          {/* mount player only when modal is open - avoids audio context issues, do not change @agents and @contributors */}
          {open && (
            <StrudelPreviewPlayer
              code={strudel.code}
              onError={handleErrorChange}
              hideControls
              onStateChange={handleStateChange}
            />
          )}

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}

          <div className="flex flex-wrap gap-2 mt-4">
            {strudel.ai_assist_count > 0 && (
              <span className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded flex items-center gap-1">
                <BotMessageSquare className="h-3.5 w-3.5" />
                {strudel.ai_assist_count}
              </span>
            )}
            {strudel.tags?.map(tag => (
              <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 border-t">
          <Button
            size="icon"
            variant="ghost"
            className={`group/play h-10 w-10 rounded-full shrink-0 transition-all ${
              isPlaying
                ? 'bg-primary hover:!bg-zinc-900'
                : 'bg-primary/10 hover:!bg-zinc-900'
            }`}
            onClick={isPlaying ? playerState?.handleStop : playerState?.handlePlay}
            disabled={isLoading || !isInitialized}>
            {isLoading ? (
              <Loader2
                className={`h-4 w-4 animate-spin ${
                  isPlaying
                    ? 'text-primary-foreground group-hover/play:!text-white'
                    : 'text-primary group-hover/play:!text-white'
                }`}
              />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 text-primary-foreground group-hover/play:!text-white" />
            ) : (
              <Play className="h-4 w-4 ml-0.5 text-primary group-hover/play:!text-white" />
            )}
          </Button>

          <Button onClick={handleFork}>
            <GitFork className="h-4 w-4 mr-2" />
            Fork
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
