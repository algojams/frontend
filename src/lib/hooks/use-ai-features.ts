"use client";

import { useSyncExternalStore } from "react";
import { getBYOKApiKey } from "@/components/shared/settings-modal/hooks";

const AI_DISABLED_KEY = "algopatterns_ai_disabled";
const BYOK_API_KEY = "algopatterns_byok_api_key";

function getAnonAIDisabled() {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(AI_DISABLED_KEY);
  if (stored === null) return true;
  return stored === "true";
}

function hasBYOKKey() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(BYOK_API_KEY);
}

function subscribeToAIFeatures(callback: () => void) {
  window.addEventListener("ai-features-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("ai-features-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAIFeaturesEnabled() {
  const anonAIDisabled = useSyncExternalStore(
    subscribeToAIFeatures,
    getAnonAIDisabled,
    () => false
  );

  const byokConfigured = useSyncExternalStore(
    subscribeToAIFeatures,
    hasBYOKKey,
    () => false
  );

  if (!byokConfigured) {
    return false;
  }

  return !anonAIDisabled;
}
