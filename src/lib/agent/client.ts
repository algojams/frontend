import { buildSystemPrompt } from './prompt';
import type { GenerateRequest, StreamEvent } from '@/lib/types/agent';

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
const OPENAI_MODEL = 'gpt-4o';

function looksLikeCode(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.includes('```')) return false;
  return (
    trimmed.startsWith('$:') ||
    trimmed.startsWith('setcpm') ||
    trimmed.startsWith('sound(') ||
    trimmed.startsWith('note(') ||
    trimmed.startsWith('hush(') ||
    /^(\$[\w]*:)/m.test(trimmed)
  );
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function buildMessages(userQuery: string, history: ChatMessage[]): ChatMessage[] {
  return [...history, { role: 'user', content: userQuery }];
}

async function streamAnthropic(
  request: GenerateRequest,
  apiKey: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const history =
    request.conversation_history?.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) ?? [];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      stream: true,
      system: buildSystemPrompt(request.editor_state),
      messages: buildMessages(request.user_query, history),
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const event = JSON.parse(data);
        if (event.type === 'content_block_delta' && event.delta?.text) {
          content += event.delta.text;
          onEvent({ type: 'chunk', content: event.delta.text });
        }
      } catch {
        // skip malformed events
      }
    }
  }

  const isCode = looksLikeCode(content);
  onEvent({ type: 'done', content, is_code_response: isCode, model: ANTHROPIC_MODEL });
}

async function streamOpenAI(
  request: GenerateRequest,
  apiKey: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const history =
    request.conversation_history?.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })) ?? [];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: 4096,
      stream: true,
      messages: [
        { role: 'system', content: buildSystemPrompt(request.editor_state) },
        ...buildMessages(request.user_query, history),
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const event = JSON.parse(data);
        const chunk = event.choices?.[0]?.delta?.content;
        if (chunk) {
          content += chunk;
          onEvent({ type: 'chunk', content: chunk });
        }
      } catch {
        // skip malformed events
      }
    }
  }

  const isCode = looksLikeCode(content);
  onEvent({ type: 'done', content, is_code_response: isCode, model: OPENAI_MODEL });
}

export async function generateStream(
  request: GenerateRequest,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const apiKey = request.provider_api_key;
  if (!apiKey) {
    throw new Error('AI features require your own API key. Add your API key in Settings.');
  }

  const provider = request.provider || 'anthropic';

  try {
    if (provider === 'openai') {
      await streamOpenAI(request, apiKey, onEvent, signal);
    } else {
      await streamAnthropic(request, apiKey, onEvent, signal);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    onEvent({ type: 'error', error: message });
    throw error;
  }
}
