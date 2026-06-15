import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import type { CCSignal, CCLicense } from '@/lib/types/strudel';
import { stripStrudelHeader } from '@/lib/utils/strudel-header';

export const SHARE_HASH_PREFIX = 's=';
/** Keep links paste-friendly in chat apps and social platforms. */
export const MAX_SHARE_ENCODED_LENGTH = 4096;

export interface SharePayload {
  c: string;
  t?: string;
  p?: CCSignal;
  l?: CCLicense;
  a?: string;
}

export function encodeSharePayload(payload: SharePayload): string {
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const parsed = JSON.parse(json) as SharePayload;
    if (!parsed || typeof parsed.c !== 'string' || !parsed.c.trim()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export type BuildShareUrlResult =
  | { url: string }
  | { error: 'empty' | 'too_large' };

export function buildShareUrl(
  payload: SharePayload,
  origin = typeof window !== 'undefined' ? window.location.origin : ''
): BuildShareUrlResult {
  const code = stripStrudelHeader(payload.c);
  if (!code.trim()) {
    return { error: 'empty' };
  }

  const encoded = encodeSharePayload({ ...payload, c: code });
  if (encoded.length > MAX_SHARE_ENCODED_LENGTH) {
    return { error: 'too_large' };
  }

  return { url: `${origin}/#${SHARE_HASH_PREFIX}${encoded}` };
}

export function getShareEncodedFromHash(hash = typeof window !== 'undefined' ? window.location.hash : ''): string | null {
  const prefix = `#${SHARE_HASH_PREFIX}`;
  if (!hash.startsWith(prefix)) {
    return null;
  }

  const encoded = hash.slice(prefix.length);
  return encoded || null;
}

export function hasShareHash(hash = typeof window !== 'undefined' ? window.location.hash : ''): boolean {
  return getShareEncodedFromHash(hash) !== null;
}
