'use client';

import { useState, useMemo, useCallback } from 'react';
import { useUIStore } from '@/lib/stores/ui';
import { toast } from 'sonner';

const AI_DISABLED_KEY = 'algopatterns_ai_disabled';
const ANON_DISPLAY_NAME_KEY = 'algopatterns_display_name';
const BYOK_PROVIDER_KEY = 'algopatterns_byok_provider';
const BYOK_API_KEY = 'algopatterns_byok_api_key';

export type BYOKProvider = 'anthropic' | 'openai';

function getAnonAIEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(AI_DISABLED_KEY);
  if (stored === null) return false;
  return stored !== 'true';
}

export function getAnonDisplayName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(ANON_DISPLAY_NAME_KEY) || '';
}

function setAnonDisplayName(name: string): void {
  if (typeof window === 'undefined') return;
  if (name.trim()) {
    localStorage.setItem(ANON_DISPLAY_NAME_KEY, name.trim());
  } else {
    localStorage.removeItem(ANON_DISPLAY_NAME_KEY);
  }
}

export function getBYOKProvider(): BYOKProvider {
  if (typeof window === 'undefined') return 'anthropic';
  return (localStorage.getItem(BYOK_PROVIDER_KEY) as BYOKProvider) || 'anthropic';
}

export function getBYOKApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(BYOK_API_KEY) || '';
}

function setBYOKProvider(provider: BYOKProvider): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BYOK_PROVIDER_KEY, provider);
  window.dispatchEvent(new Event('ai-features-changed'));
}

function setBYOKApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(BYOK_API_KEY, key.trim());
  } else {
    localStorage.removeItem(BYOK_API_KEY);
  }
  window.dispatchEvent(new Event('ai-features-changed'));
}

export function useSettingsModal() {
  const { isSettingsModalOpen, setSettingsModalOpen } = useUIStore();
  const [optimisticValue, setOptimisticValue] = useState<boolean | null>(null);
  const [byokApiKey, setBYOKApiKeyState] = useState<string>(() => getBYOKApiKey());

  const handleDisplayNameChange = useCallback((value: string) => {
    setAnonDisplayName(value);
  }, []);

  const handleBYOKProviderChange = useCallback((provider: BYOKProvider) => {
    setBYOKProvider(provider);
  }, []);

  const handleBYOKApiKeyChange = useCallback((key: string) => {
    setBYOKApiKey(key);
    setBYOKApiKeyState(key);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setOptimisticValue(null);
    }
    setSettingsModalOpen(open);
  }, [setSettingsModalOpen]);

  const sourceValue = useMemo(() => {
    if (!isSettingsModalOpen) return true;
    return getAnonAIEnabled();
  }, [isSettingsModalOpen]);

  const aiEnabled = optimisticValue ?? sourceValue;

  const handleAiToggle = useCallback((checked: boolean) => {
    setOptimisticValue(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_DISABLED_KEY, checked ? 'false' : 'true');
      window.dispatchEvent(new Event('ai-features-changed'));
    }
    toast.success(checked ? 'AI features enabled' : 'AI features disabled');
  }, []);

  return {
    isSettingsModalOpen,
    handleOpenChange,
    aiEnabled,
    handleAiToggle,
    handleDisplayNameChange,
    handleBYOKProviderChange,
    handleBYOKApiKeyChange,
    byokApiKey,
  };
}
