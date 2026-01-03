"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./query-provider";
import { AuthHydration } from "./auth-hydration";
import { Toaster } from "@/components/ui/sonner";
import { LoginModal } from "@/components/shared/login-modal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="algorave-theme"
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthHydration>
          {children}
          <LoginModal />
          <Toaster />
        </AuthHydration>
      </QueryProvider>
    </ThemeProvider>
  );
}
