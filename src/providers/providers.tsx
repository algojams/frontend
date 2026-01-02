"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthHydration } from "./auth-hydration";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthHydration>
        {children}
        <Toaster />
      </AuthHydration>
    </QueryProvider>
  );
}
