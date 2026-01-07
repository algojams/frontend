'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitFork, Sparkles, ExternalLink } from 'lucide-react';
import type { Strudel } from '@/lib/api/strudels/types';
import { useEditorStore } from '@/lib/stores/editor';
import { useUIStore } from '@/lib/stores/ui';
import { EDITOR } from '@/lib/constants';

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
  const router = useRouter();
  const { isDirty, code, currentStrudelId } = useEditorStore();
  const { setPendingForkId } = useUIStore();

  if (!strudel) return null;

  const handleOpen = () => {
    onOpenChange(false);
    router.push(`/?id=${strudel.id}`);
  };

  const handleFork = () => {
    const hasUnsavedChanges = isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);

    onOpenChange(false);

    if (hasUnsavedChanges) {
      setPendingForkId(strudel.id);
    } else {
      router.push(`/?fork=${strudel.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {strudel.title}
          </DialogTitle>
          {strudel.description && (
            <DialogDescription>{strudel.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <pre className="flex-1 text-sm bg-muted p-4 rounded-lg overflow-auto font-mono whitespace-pre-wrap break-words">
            {strudel.code}
          </pre>

          <div className="flex flex-wrap gap-2 mt-4">
            {strudel.ai_assist_count > 0 && (
              <span className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Assisted ({strudel.ai_assist_count})
              </span>
            )}
            {strudel.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleOpen}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
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
