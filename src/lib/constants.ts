export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export const STORAGE_KEYS = {
  SESSION_ID: "algorave_session_id",
  REDIRECT_AFTER_LOGIN: "redirect_after_login",
} as const;

export const WEBSOCKET = {
  RECONNECT_MAX_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 1000,
  PING_INTERVAL_MS: 30000,
  CONNECTION_TIMEOUT_MS: 10000,
} as const;

export const RATE_LIMITS = {
  CODE_UPDATES_PER_SECOND: 10,
  CHAT_MESSAGES_PER_MINUTE: 20,
  AGENT_REQUESTS_PER_MINUTE: 10,
} as const;

export const EDITOR = {
  MAX_CODE_SIZE_BYTES: 100 * 1024, // 100KB
  DEFAULT_CODE: `// Welcome to Algorave!
// Press Ctrl+Enter (Cmd+Enter on Mac) to play
// Press Ctrl+. (Cmd+.) to stop

sound("bd sd")`,
} as const;
