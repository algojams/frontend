'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  GitFork,
  BotMessageSquare,
  Play,
  Pause,
  Loader2,
  Scale,
  Activity,
  ExternalLink,
} from 'lucide-react';
import type { Strudel, CCLicense, CCSignal } from '@/lib/api/strudels/types';
import { CC_SIGNALS, CC_LICENSES } from '@/lib/api/strudels/types';
import {
  StrudelPreviewPlayer,
  type PlayerState,
} from '@/components/shared/strudel-preview-player';
import { useStrudelPreviewModal } from './hooks';

// detailed descriptions for license popover
const LICENSE_DETAILS: Record<CCLicense, { description: string; url: string }> = {
  'CC0 1.0': {
    description: 'No rights reserved. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'CC BY 4.0': {
    description: 'You may share and adapt for any purpose, even commercially, as long as you give appropriate credit to the original creator.',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  'CC BY-SA 4.0': {
    description: 'You may share and adapt for any purpose, even commercially, as long as you give credit and license your derivatives under the same terms.',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'CC BY-NC 4.0': {
    description: 'You may share and adapt for non-commercial purposes only, as long as you give appropriate credit.',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
  'CC BY-NC-SA 4.0': {
    description: 'You may share and adapt for non-commercial purposes only, as long as you give credit and license derivatives under the same terms.',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
  'CC BY-ND 4.0': {
    description: 'You may share for any purpose, even commercially, as long as you give credit and do not modify the original work.',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
  },
  'CC BY-NC-ND 4.0': {
    description: 'You may share for non-commercial purposes only, as long as you give credit and do not modify the original work.',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
};

// detailed descriptions for signal popover
const SIGNAL_DETAILS: Record<CCSignal, string> = {
  'cc-cr': 'AI systems may use this work for training or inference, provided they give appropriate credit/attribution to the creator.',
  'cc-dc': 'AI systems may use this work with attribution and should support the creator (e.g., through payment, promotion, or other means).',
  'cc-ec': 'AI systems may use this work with attribution and should contribute back to the open creative ecosystem.',
  'cc-op': 'AI systems may use this work with attribution, but the resulting AI model or agent must remain open source.',
  'no-ai': 'This work may not be used for AI training or inference purposes.',
};

// blog post explaining CC signals
const SIGNALS_BLOG_URL = 'https://creativecommons.org/2024/04/04/cc-and-data-signals/';

// signal colors matching about page
const SIGNAL_COLORS: Record<CCSignal | 'default', { text: string; hover: string }> = {
  'cc-cr': { text: 'text-blue-500', hover: 'hover:text-blue-400' },
  'cc-dc': { text: 'text-emerald-500', hover: 'hover:text-emerald-400' },
  'cc-ec': { text: 'text-purple-500', hover: 'hover:text-purple-400' },
  'cc-op': { text: 'text-amber-500', hover: 'hover:text-amber-400' },
  'no-ai': { text: 'text-rose-500', hover: 'hover:text-rose-400' },
  'default': { text: 'text-rose-500', hover: 'hover:text-rose-400' },
};

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
        <DialogHeader className="flex flex-col gap-6">
          <DialogTitle className="flex items-center gap-2 text-xl leading-1">
            {strudel.title}
            {strudel.author_name && (
              <span className="text-sm font-normal text-muted-foreground">
                by {strudel.author_name}
              </span>
            )}
          </DialogTitle>

          {(strudel.license || strudel.cc_signal) && (
            <>
            <div className="w-full h-px bg-white/5" />

            <div className="flex items-center gap-4 text-sm text-muted-foreground -mt-2">
              {strudel.license && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors cursor-pointer">
                      <Scale className="h-4 w-4" />
                      {strudel.license}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-light">
                        Creative Commons licenses let creators share their work while keeping some rights.
                        They range from very permissive (CC0) to restrictive (NC, ND).
                      </p>
                      <div className="border-t pt-3">
                        <p className="font-medium text-sm mb-1">
                          {CC_LICENSES.find(l => l.id === strudel.license)?.label}
                        </p>
                        <p className="text-sm text-muted-foreground font-light">
                          {LICENSE_DETAILS[strudel.license]?.description}
                        </p>
                      </div>
                      <a
                        href={LICENSE_DETAILS[strudel.license]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 hover:underline">
                        View full license
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {strudel.license && <div className="h-4 w-px bg-white/5" />}

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1 text-white/50 hover:text-white/70 transition-colors cursor-pointer">
                    <Activity className="h-3.5 w-3.5" />
                    {strudel.cc_signal?.toUpperCase() || 'NO-AI'} (
                    {CC_SIGNALS.find(s => s.id === strudel.cc_signal)?.label ??
                      'AI use not allowed'}
                    )
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-light">
                      CC Signals indicate how creators want AI systems to interact with their work.
                      These are preferences that help AI developers respect creator intent.
                    </p>
                    <div className="border-t pt-3">
                      <p className="font-medium text-sm mb-1">
                        {CC_SIGNALS.find(s => s.id === strudel.cc_signal)?.label ?? 'No AI'}
                      </p>
                      <p className="text-sm text-muted-foreground font-light">
                        {SIGNAL_DETAILS[strudel.cc_signal as CCSignal] ?? SIGNAL_DETAILS['no-ai']}
                      </p>
                    </div>
                    <a
                      href={SIGNALS_BLOG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm hover:underline ${
                        SIGNAL_COLORS[strudel.cc_signal as CCSignal]?.text ?? SIGNAL_COLORS.default.text
                      } ${
                        SIGNAL_COLORS[strudel.cc_signal as CCSignal]?.hover ?? SIGNAL_COLORS.default.hover
                      }`}>
                      Learn about CC Signals
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            </>
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
