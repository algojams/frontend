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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import type { Strudel, CCSignal, CCLicense } from '@/lib/types/strudel';
import {
  CC_SIGNALS,
  CC_LICENSES,
  SIGNAL_RESTRICTIVENESS,
  inferSignalFromLicense,
} from '@/lib/types/strudel';
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
    license,
    handleLicenseChange,
    ccSignal,
    handleSignalChange,
    signalOverridden,
    defaultSignal,
    setError,
    error,
    isCreate,
    isPending,
    parentCCSignal,
    hasAIAssistance,
    handleSave,
  } = useStrudelForm(strudel, mode, onClose);

  const inferredSignal = inferSignalFromLicense(license);

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

        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <Label>License</Label>
            <Select
              value={license || ''}
              onValueChange={v => handleLicenseChange((v || null) as CCLicense | null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select license (optional)..." />
              </SelectTrigger>
              <SelectContent>
                {CC_LICENSES.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="h-4 w-4 shrink-0 mt-9 text-muted-foreground" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Label>AI/CC Signal</Label>
              {license && inferredSignal && !signalOverridden && (
                <span className="text-xs text-muted-foreground leading-0">
                  (inferred from license)
                </span>
              )}
              {signalOverridden && (
                <span className="text-xs text-orange-400 leading-0">(custom)</span>
              )}
            </div>
            <Select
              value={ccSignal || defaultSignal}
              onValueChange={v => handleSignalChange((v as CCSignal) || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="AI/CC signal..." />
              </SelectTrigger>
              <SelectContent>
                {CC_SIGNALS.filter(s => {
                  if (
                    parentCCSignal &&
                    SIGNAL_RESTRICTIVENESS[s.id] < SIGNAL_RESTRICTIVENESS[parentCCSignal]
                  ) {
                    return false;
                  }
                  return true;
                }).map(signal => {
                  const isDisabled = hasAIAssistance && signal.id === 'no-ai';
                  return (
                    <SelectItem key={signal.id} value={signal.id} disabled={isDisabled}>
                      <span className="font-medium uppercase">{signal.id}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {isDisabled ? 'Disabled - AI assistance detected' : signal.desc}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-sm text-muted-foreground pt-2">
          Your strudel is saved in this browser only. License and CC signal travel with
          share links and code headers.
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
