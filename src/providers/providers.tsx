"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { LoginModal } from "@/components/shared/login-modal";
import { LogoutConfirmDialog } from "@/components/shared/logout-confirm-dialog";
import { NewStrudelDialog } from "@/components/shared/new-strudel-dialog";
import { SaveStrudelDialog } from "@/components/shared/save-strudel-dialog";
import { InviteDialog } from "@/components/shared/invite-dialog";
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
        <LoginModal />
        <LogoutConfirmDialog />
        <NewStrudelDialog />
        <SaveStrudelDialog />
        <InviteDialog />
        <ForkConfirmDialog />
        <OpenStrudelConfirmDialog />
        <DraftsModal />
        <SettingsModal />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
