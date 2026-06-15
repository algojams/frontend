'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StrudelEditor } from '@/components/shared/strudel-editor';
import { EditorToolbar } from '@/components/shared/editor-toolbar';
import { SidebarPanel } from '@/components/shared/sidebar-panel';
import { AIInput } from '@/components/shared/ai-input';
import { Button } from '@/components/ui/button';
import { Headphones, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from './hooks';
import { useUIStore } from '@/lib/stores/ui';
import { usePlayerStore } from '@/lib/stores/player';
import { useAIFeaturesEnabled } from '@/lib/hooks/use-ai-features';
import { useResizable } from '@/lib/hooks/use-resizable';

const MD_BREAKPOINT = 768;

function HomePageContent() {
  const searchParams = useSearchParams();
  const strudelId = searchParams.get('id');
  const forkStrudelId = searchParams.get('fork');

  const {
    setChatPanelOpen,
    chatPanelWidth,
    setChatPanelWidth,
    desktopSidebarOpen,
    setDesktopSidebarOpen,
  } = useUIStore();
  const { currentStrudel: playerStrudel } = usePlayerStore();
  const aiEnabled = useAIFeaturesEnabled();

  const { handleMouseDown: handleSidebarMouseDown } = useResizable({
    initialSize: chatPanelWidth,
    onResize: setChatPanelWidth,
    direction: 'left',
  });

  const {
    handleCodeChange,
    handlePlay,
    handleStop,
    handleUpdate,
    handleSendAIRequest,
    handleSave,
    handleRestore,
    handleNewStrudel,
    handleFormat,
    handleShare,
    isChatPanelOpen,
    toggleChatPanel,
    saveStatus,
    hasRestorableVersion,
    isLoadingStrudel,
    isFormatting,
  } = useEditor({ strudelId, forkStrudelId });

  useEffect(() => {
    if (window.innerWidth >= MD_BREAKPOINT) {
      setChatPanelOpen(desktopSidebarOpen);
    }

    const handleResize = () => {
      if (window.innerWidth >= MD_BREAKPOINT) {
        setChatPanelOpen(desktopSidebarOpen);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopSidebarOpen, setChatPanelOpen]);

  const handleToggleDesktopSidebar = () => {
    const newState = !isChatPanelOpen;
    setChatPanelOpen(newState);
    setDesktopSidebarOpen(newState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        handleFormat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat]);

  const sidebarVisible = isChatPanelOpen;

  return (
    <div className={cn("flex h-full overflow-hidden pl-3 pr-3 transition-[padding] duration-200 ease-out", sidebarVisible && "md:pr-0", aiEnabled && "pb-3", playerStrudel && "pb-16")}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className={cn("flex-1 flex flex-col min-w-0 overflow-hidden rounded-xl border border-border bg-background relative transition-[border-radius] duration-200 ease-out", sidebarVisible && "md:rounded-l-xl md:rounded-r-none", playerStrudel && !aiEnabled && "border-b-0 !rounded-bl-none !rounded-br-none")}>
          <EditorToolbar
            onPlay={handlePlay}
            onStop={handleStop}
            onUpdate={handleUpdate}
            onSave={handleSave}
            onRestore={handleRestore}
            onNew={handleNewStrudel}
            onShare={handleShare}
            onToggleSidebar={handleToggleDesktopSidebar}
            onFormat={handleFormat}
            showSave
            showNew
            showShare
            isSidebarOpen={sidebarVisible}
            saveStatus={saveStatus}
            hasRestorableVersion={hasRestorableVersion()}
            isFormatting={isFormatting}
          />
          <div className="flex-1 overflow-hidden relative">
            {isLoadingStrudel && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading strudel...</p>
                </div>
              </div>
            )}
            <StrudelEditor onCodeChange={handleCodeChange} />
          </div>
          {sidebarVisible && (
            <div
              onMouseDown={handleSidebarMouseDown}
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-10 hidden md:block"
            />
          )}
        </div>

        {aiEnabled && (
          <AIInput onSendAIRequest={handleSendAIRequest} />
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed right-7 z-50 md:hidden rounded-full h-12 w-12 shadow-lg !bg-background",
          aiEnabled
            ? playerStrudel ? "bottom-36" : "bottom-20"
            : playerStrudel ? "bottom-20" : "bottom-6"
        )}
        onClick={toggleChatPanel}
        aria-label={isChatPanelOpen ? 'Close panel' : 'Open panel'}>
        <Headphones className="h-5 w-5" />
      </Button>

      <div
        className={cn('overflow-hidden hidden md:flex', {
          'w-0': !isChatPanelOpen,
        })}
        style={{ width: isChatPanelOpen ? chatPanelWidth : 0 }}>
        {isChatPanelOpen && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <SidebarPanel />
          </div>
        )}
      </div>

      {isChatPanelOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleChatPanel} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background">
            <SidebarPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">Loading...</div>
      }>
      <HomePageContent />
    </Suspense>
  );
}
