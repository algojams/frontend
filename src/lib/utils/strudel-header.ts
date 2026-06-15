import type { CCLicense } from '@/lib/types/strudel';
import { CC_LICENSE_URLS } from '@/lib/types/strudel';

export interface StrudelHeaderMeta {
  title?: string | null;
  license?: CCLicense | null;
  author?: string | null;
}

const TITLE_LINE = /^\/\/ "(.+)"\s*$/;
const LICENSE_LINE = /^\/\/ @license .+$/;
const BY_LINE = /^\/\/ @by .+$/;

function isHeaderLine(line: string): boolean {
  const trimmed = line.trim();
  return TITLE_LINE.test(trimmed) || LICENSE_LINE.test(trimmed) || BY_LINE.test(trimmed);
}

/** Remove attribution header comments from the top of strudel code. */
export function stripStrudelHeader(code: string): string {
  const lines = code.split('\n');
  let index = 0;

  while (index < lines.length && lines[index].trim() === '') {
    index++;
  }

  if (index >= lines.length || !TITLE_LINE.test(lines[index].trim())) {
    return code;
  }

  index++;
  while (index < lines.length && isHeaderLine(lines[index])) {
    index++;
  }

  while (index < lines.length && lines[index].trim() === '') {
    index++;
  }

  return lines.slice(index).join('\n');
}

/** Build attribution header comment lines (without trailing body). */
export function buildStrudelHeader(meta: StrudelHeaderMeta): string {
  const lines: string[] = [];
  const title = meta.title?.trim() || 'untitled strudel';
  lines.push(`// "${title}"`);

  if (meta.license) {
    const url = CC_LICENSE_URLS[meta.license];
    lines.push(`// @license ${meta.license} ${url}`);
  }

  const author = meta.author?.trim() || 'anonymous';
  lines.push(`// @by ${author}`);

  return lines.join('\n');
}

/** Prepend a fresh attribution header, replacing any existing one. */
export function withStrudelHeader(code: string, meta: StrudelHeaderMeta): string {
  const body = stripStrudelHeader(code);
  const header = buildStrudelHeader(meta);
  if (!body) {
    return `${header}\n\n`;
  }
  return `${header}\n\n${body}`;
}
