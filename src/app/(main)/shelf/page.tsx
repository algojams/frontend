'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StrudelCard } from '@/components/shared/strudel-card';
import { Button } from '@/components/ui/button';
import { StrudelPreviewModal } from '@/components/shared/strudel-preview-modal';
import { LocalStrudelSettingsDialog } from '@/components/shared/local-strudel-settings-dialog';
import { useDashboard } from './hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Settings, Pencil, Eye, Trash2 } from 'lucide-react';
import type { Strudel } from '@/lib/api/strudels/types';
import { useEditorStore } from '@/lib/stores/editor';
import { useUIStore } from '@/lib/stores/ui';
import { usePlayerStore } from '@/lib/stores/player';
import { storage } from '@/lib/utils/storage';
import { EDITOR } from '@/lib/constants';

function DashboardContent() {
  const { strudels, isLoading, router, refreshLocalStrudels } = useDashboard();
  const [selectedStrudel, setSelectedStrudel] = useState<Strudel | null>(null);
  const [localSettingsOpen, setLocalSettingsOpen] = useState(false);
  const [previewStrudel, setPreviewStrudel] = useState<Strudel | null>(null);
  const [deleteStrudel, setDeleteStrudel] = useState<Strudel | null>(null);

  const { isDirty, code, currentStrudelId } = useEditorStore();
  const { setPendingOpenStrudelId } = useUIStore();
  const { currentStrudel: playerStrudel } = usePlayerStore();

  const handleOpenStrudel = (strudelId: string) => {
    if (strudelId === currentStrudelId) {
      router.push(`/?id=${strudelId}`);
      return;
    }

    const hasUnsavedChanges =
      isDirty || (!currentStrudelId && code !== EDITOR.DEFAULT_CODE);

    if (hasUnsavedChanges) {
      setPendingOpenStrudelId(strudelId);
    } else {
      router.push(`/?id=${strudelId}`);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteStrudel) return;
    storage.deleteLocalStrudel(deleteStrudel.id);
    refreshLocalStrudels();
    setDeleteStrudel(null);
  };

  return (
    <div className={`container px-6 py-4 md:p-8 w-full max-w-full ${playerStrudel ? 'pb-24' : ''}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Shelf</h1>
          <p className="text-[15px] md:text-base text-muted-foreground">
            Your locally saved creations
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse rounded-md">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : strudels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {strudels.map(strudel => (
            <StrudelCard
              key={strudel.id}
              strudel={strudel}
              showCodePreview
              maxTags={4}
              actions={
                <>
                  <Button
                    size="icon-round-sm"
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedStrudel(strudel);
                      setLocalSettingsOpen(true);
                    }}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-round-sm"
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setPreviewStrudel(strudel)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-round-sm"
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleOpenStrudel(strudel.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-round-sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteStrudel(strudel)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-muted-foreground mb-4">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>

            <h3 className="text-lg font-medium mb-2">No strudels yet</h3>

            <p className="text-muted-foreground text-center mb-4">
              Create and save strudels in your browser
            </p>

            <Button asChild>
              <Link href="/">Create your first strudel</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <LocalStrudelSettingsDialog
        strudel={selectedStrudel}
        open={localSettingsOpen}
        onOpenChange={setLocalSettingsOpen}
        onSave={refreshLocalStrudels}
      />

      <StrudelPreviewModal
        strudel={previewStrudel}
        open={!!previewStrudel}
        onOpenChange={open => !open && setPreviewStrudel(null)}
      />

      <AlertDialog open={!!deleteStrudel} onOpenChange={open => !open && setDeleteStrudel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strudel</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete &ldquo;{deleteStrudel?.title}&rdquo;? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
        </div>
      }>
      <DashboardContent />
    </Suspense>
  );
}
