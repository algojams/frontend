'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Square, Plus, RefreshCw, RotateCcw, PanelRight, Share2, WrapText } from 'lucide-react';
import { useEditorToolbar, type SaveStatus } from './hooks';
import { SaveIndicator, AudioEngineIndicator } from './indicators';

interface EditorToolbarProps {
  onPlay: () => void;
  onStop: () => void;
  onUpdate: () => void;
  onSave?: () => void;
  onRestore?: () => void;
  onNew?: () => void;
  onShare?: () => void;
  onToggleSidebar?: () => void;
  onFormat?: () => void;
  showSave?: boolean;
  showNew?: boolean;
  showShare?: boolean;
  isSidebarOpen?: boolean;
  saveStatus?: SaveStatus;
  hasRestorableVersion?: boolean;
  isFormatting?: boolean;
}

export function EditorToolbar({
  onPlay,
  onStop,
  onUpdate,
  onSave,
  onRestore,
  onNew,
  onShare,
  onToggleSidebar,
  onFormat,
  showSave = false,
  showNew = false,
  showShare = true,
  isSidebarOpen = true,
  saveStatus = 'saved',
  hasRestorableVersion = false,
  isFormatting = false,
}: EditorToolbarProps) {
  const { isPlaying, isInitialized, isCodeDirty, audioEngineStatus, audioEngineLabel } =
    useEditorToolbar();

  return (
    <div className="flex items-center gap-2 p-2 bg-background h-12 min-w-0">
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant={isPlaying ? 'outline' : 'default'}
          onClick={isPlaying ? onStop : onPlay}
          disabled={!isInitialized && !isPlaying}
          className="rounded-sm min-w-20"
          title={isPlaying ? 'Stop (Ctrl+.)' : 'Play (Ctrl+Enter)'}>
          {isPlaying ? (
            <Square className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onUpdate}
          disabled={!isPlaying || !isCodeDirty}
          className="rounded-sm aspect-square px-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
        {onFormat && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onFormat}
                disabled={isFormatting}
                className="rounded-sm aspect-square px-0">
                <WrapText className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Format code (Alt+Shift+F)</TooltipContent>
          </Tooltip>
        )}
        {showShare && onShare && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onShare}
                className="rounded-sm aspect-square px-0">
                <Share2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy share link</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0" />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AudioEngineIndicator status={audioEngineStatus} label={audioEngineLabel} />
      </div>

      <div className="flex-1 min-w-0" />

      <div className="flex items-center gap-2 shrink-0">
      {showSave && hasRestorableVersion && onRestore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-round-sm"
              variant="outline"
              onClick={onRestore}
              className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Restore last saved version</TooltipContent>
        </Tooltip>
      )}

      {showSave && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-round-sm"
              variant="outline"
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              className="text-muted-foreground hover:text-foreground">
              <SaveIndicator status={saveStatus} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {saveStatus === 'saved' && 'All changes saved locally'}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
          </TooltipContent>
        </Tooltip>
      )}

      {showNew && onNew && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-round-sm"
              variant="outline"
              onClick={onNew}
              className="text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Strudel</TooltipContent>
        </Tooltip>
      )}

      {onToggleSidebar && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-round-sm"
              variant="outline"
              onClick={onToggleSidebar}
              className="hidden md:inline-flex text-muted-foreground hover:text-foreground">
              <PanelRight className={isSidebarOpen ? 'h-4 w-4' : 'h-4 w-4 opacity-50'} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}</TooltipContent>
        </Tooltip>
      )}
      </div>
    </div>
  );
}
