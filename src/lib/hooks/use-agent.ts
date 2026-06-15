'use client';

import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateStream } from '@/lib/agent/client';
import { useEditorStore } from '@/lib/stores/editor';
import { storage } from '@/lib/utils/storage';
import { getBYOKProvider, getBYOKApiKey } from '@/components/shared/settings-modal/hooks';
import type { GenerateRequest, GenerateResponse, StreamEvent } from '@/lib/api/agent/types';

export function useAgentGenerate() {
  const { setAIGenerating, addToHistory, updateMessage } = useEditorStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  return useMutation({
    meta: { skipGlobalErrorToast: true },
    mutationFn: async (query: string) => {
      const {
        code,
        conversationHistory,
        forkedFromId,
        parentCCSignal,
      } = useEditorStore.getState();

      const parentSignalBlocksAI = !parentCCSignal || parentCCSignal === 'no-ai';
      if (forkedFromId && parentSignalBlocksAI) {
        throw new Error('AI assistant is disabled - the original strudel does not permit AI use');
      }

      const byokApiKey = getBYOKApiKey();
      const byokProvider = byokApiKey ? getBYOKProvider() : undefined;

      if (!byokApiKey) {
        throw new Error('AI features require your own API key. Add your API key in Settings.');
      }

      const request: GenerateRequest = {
        user_query: query,
        editor_state: code,
        conversation_history: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        provider: byokProvider,
        provider_api_key: byokApiKey,
      };

      return streamGenerate(request);
    },

    onMutate: (query: string) => {
      setAIGenerating(true);
      addToHistory({
        id: crypto.randomUUID(),
        role: 'user',
        content: query,
        created_at: new Date().toISOString(),
      });
      saveDraft();
    },

    onSuccess: (response: GenerateResponse) => {
      setAIGenerating(false);

      if (!response._streamed) {
        const hasContent = response.code || response.clarifying_questions?.length;
        if (hasContent) {
          addToHistory({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: response.code || '',
            is_actionable: response.is_actionable,
            is_code_response: response.is_code_response,
            clarifying_questions: response.clarifying_questions,
            created_at: new Date().toISOString(),
          });
        }
      }

      saveDraft();
    },

    onError: (error: Error) => {
      setAIGenerating(false);

      const isNoAIRestricted = error.message.includes('does not permit AI');
      const errorMessage = isNoAIRestricted
        ? 'AI assistant is disabled - the original strudel does not permit AI use.'
        : `Error: ${error.message}`;

      addToHistory({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: errorMessage,
        is_code_response: false,
        created_at: new Date().toISOString(),
      });
    },
  });

  async function streamGenerate(
    request: GenerateRequest
  ): Promise<GenerateResponse & { _streamed?: boolean }> {
    abortControllerRef.current = new AbortController();

    const messageId = crypto.randomUUID();
    let streamedContent = '';
    let finalContent = '';
    let finalIsCode = false;
    let finalModel = '';

    addToHistory({
      id: messageId,
      role: 'assistant',
      content: '',
      is_streaming: true,
      created_at: new Date().toISOString(),
    });

    try {
      await generateStream(
        request,
        (event: StreamEvent) => {
          switch (event.type) {
            case 'chunk':
              streamedContent += event.content || '';
              updateMessage(messageId, { content: streamedContent });
              break;

            case 'done':
              finalContent = event.content || streamedContent;
              finalIsCode = event.is_code_response || false;
              finalModel = event.model || '';
              updateMessage(messageId, {
                content: finalContent,
                is_streaming: false,
                is_code_response: finalIsCode,
              });
              break;

            case 'error':
              updateMessage(messageId, {
                content: `Error: ${event.error}`,
                is_streaming: false,
              });
              throw new Error(event.error);
          }
        },
        abortControllerRef.current.signal
      );

      return {
        code: finalContent || streamedContent,
        is_actionable: true,
        is_code_response: finalIsCode,
        docs_retrieved: 0,
        examples_retrieved: 0,
        model: finalModel,
        _streamed: true,
      };
    } catch (error) {
      updateMessage(messageId, {
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        is_streaming: false,
      });
      throw error;
    }
  }

  function saveDraft() {
    const { code, conversationHistory, currentStrudelId, currentDraftId } = useEditorStore.getState();
    const draftId = currentStrudelId || currentDraftId;

    if (draftId) {
      storage.setDraft({
        id: draftId,
        code,
        conversationHistory,
        updatedAt: Date.now(),
      });
    }
  }
}
