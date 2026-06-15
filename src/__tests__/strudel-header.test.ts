import { describe, it, expect } from 'vitest';
import {
  buildStrudelHeader,
  stripStrudelHeader,
  withStrudelHeader,
} from '@/lib/utils/strudel-header';

describe('strudel-header utilities', () => {
  const body = 'setCpm(120)\n$: s("bd*4")';

  it('builds header with title, license, and author', () => {
    expect(
      buildStrudelHeader({
        title: 'Test Pattern',
        license: 'CC BY-NC-SA 4.0',
        author: 'Test Author',
      })
    ).toBe(
      '// "Test Pattern"\n' +
        '// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/\n' +
        '// @by Test Author'
    );
  });

  it('uses placeholders and skips missing license', () => {
    expect(buildStrudelHeader({})).toBe('// "untitled strudel"\n// @by anonymous');
  });

  it('strips an existing header before prepending a new one', () => {
    const withHeader = withStrudelHeader(body, {
      title: 'Old title',
      license: 'CC BY 4.0',
      author: 'First Author',
    });

    const updated = withStrudelHeader(withHeader, {
      title: 'New title',
      author: 'Second Author',
    });

    expect(updated).toBe(`// "New title"\n// @by Second Author\n\n${body}`);
  });

  it('leaves code without a header unchanged when stripping', () => {
    expect(stripStrudelHeader(body)).toBe(body);
  });
});
