"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NewStrudelDialog } from "@/components/shared/new-strudel-dialog";
import { SaveStrudelDialog } from "@/components/shared/save-strudel-dialog";
import { ForkConfirmDialog } from "@/components/shared/fork-confirm-dialog";
import { OpenStrudelConfirmDialog } from "@/components/shared/open-strudel-confirm-dialog";
import { DraftsModal } from "@/components/shared/drafts-modal";
import { SettingsModal } from "@/components/shared/settings-modal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      themes={['dark', 'light', 'blue', 'pink']}
      storageKey="algopatterns-theme"
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <NewStrudelDialog />
        <SaveStrudelDialog />
        <ForkConfirmDialog />
        <OpenStrudelConfirmDialog />
        <DraftsModal />
        <SettingsModal />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
