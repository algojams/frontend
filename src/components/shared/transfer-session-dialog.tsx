'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/lib/stores/ui';
import { useTransferSession } from '@/lib/hooks/use-sessions';
import { storage } from '@/lib/utils/storage';
import { toast } from 'sonner';

export function TransferSessionDialog() {
  const { isTransferDialogOpen, setTransferDialogOpen } = useUIStore();
  const [title, setTitle] = useState('');
  const transferSession = useTransferSession();

  const sessionId = storage.getSessionId();

  const handleTransfer = async () => {
    if (!sessionId || !title.trim()) return;

    try {
      await transferSession.mutateAsync({
        session_id: sessionId,
        title: title.trim(),
      });
      toast.success('Session saved to your strudels');
      setTransferDialogOpen(false);
      setTitle('');
    } catch (error) {
      toast.error('Failed to save session');
      console.error('Transfer error:', error);
    }
  };

  const handleSkip = () => {
    setTransferDialogOpen(false);
    setTitle('');
  };

  return (
    <Dialog open={isTransferDialogOpen} onOpenChange={setTransferDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your session</DialogTitle>
          <DialogDescription>
            You were editing as a guest. Would you like to save this session to your account?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="strudel-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="strudel-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="My awesome strudel"
            className="mt-2"
            onKeyDown={e => {
              if (e.key === 'Enter' && title.trim()) {
                handleTransfer();
              }
            }}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!title.trim() || transferSession.isPending}>
            {transferSession.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
