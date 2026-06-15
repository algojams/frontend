'use client';

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Strudel } from '@/lib/types/strudel';
import { useStrudelForm } from './hooks';

interface StrudelFormProps {
  strudel?: Strudel | null;
  mode: 'create' | 'edit';
  onClose: () => void;
}

export function StrudelForm({ strudel, mode, onClose }: StrudelFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    setError,
    isCreate,
    isPending,
    handleSave,
  } = useStrudelForm(strudel, mode, onClose);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isCreate ? 'Save Strudel' : 'Strudel Settings'}</DialogTitle>
        <DialogDescription>
          {isCreate
            ? 'Save your strudel locally in your browser.'
            : 'Update your strudel details.'}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="strudel-title">Title</Label>
          <Input
            id="strudel-title"
            placeholder="My awesome strudel"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError('');
            }}
            autoFocus
          />
        </div>

        {!isCreate && (
          <div className="space-y-2">
            <Label htmlFor="strudel-description">Description</Label>
            <Textarea
              id="strudel-description"
              placeholder="A brief description of your strudel..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="strudel-tags">Tags</Label>
          <Input
            id="strudel-tags"
            placeholder="ambient, chill, beats (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <p className="text-sm text-muted-foreground pt-2">
          Your strudel is saved in this browser only.
        </p>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </>
  );
}
