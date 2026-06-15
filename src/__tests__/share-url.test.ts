import { describe, it, expect } from 'vitest';
import {
  buildShareUrl,
  decodeSharePayload,
  encodeSharePayload,
  getShareEncodedFromHash,
  hasShareHash,
} from '@/lib/utils/share-url';

describe('share-url utilities', () => {
  const samplePayload = {
    c: 'setCpm(120)\n$: s("bd*4")',
    t: 'Test beat',
    p: 'no-ai' as const,
  };

  it('round-trips payload through encode and decode', () => {
    const encoded = encodeSharePayload(samplePayload);
    expect(decodeSharePayload(encoded)).toEqual(samplePayload);
  });

  it('builds a hash-based share URL', () => {
    const result = buildShareUrl(samplePayload, 'https://algopatterns.cc');
    expect('url' in result).toBe(true);
    if ('url' in result) {
      expect(result.url).toMatch(/^https:\/\/algopatterns\.cc\/#s=/);
    }
  });

  it('rejects empty code', () => {
    const result = buildShareUrl({ c: '   ' });
    expect(result).toEqual({ error: 'empty' });
  });

  it('rejects payloads that exceed the encoded length limit', () => {
    const hugeCode = Array.from(
      { length: 6000 },
      (_, i) => `note("<${i} ${Math.sin(i)} ${Math.cos(i)}>")`
    ).join('\n');
    const result = buildShareUrl({ c: hugeCode });
    expect(result).toEqual({ error: 'too_large' });
  });

  it('parses share hash fragments', () => {
    const encoded = encodeSharePayload(samplePayload);
    expect(hasShareHash(`#s=${encoded}`)).toBe(true);
    expect(getShareEncodedFromHash(`#s=${encoded}`)).toBe(encoded);
    expect(hasShareHash('#other')).toBe(false);
  });

  it('returns null for invalid encoded payloads', () => {
    expect(decodeSharePayload('not-valid')).toBeNull();
    expect(decodeSharePayload(encodeSharePayload({ c: '   ' }))).toBeNull();
  });
});
