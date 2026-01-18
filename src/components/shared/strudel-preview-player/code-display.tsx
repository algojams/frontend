'use client';

import { useMemo } from 'react';

// strudel theme colors
const COLORS = {
  grey: '#7c859a',    // comments, brackets
  purple: '#c792ea',  // function names
  blue: '#7fc9e6',    // $:, /, ., ,
  green: '#b8dd87',   // everything else (strings, numbers, identifiers)
};

interface CodeDisplayProps {
  code: string;
}

// simple syntax highlighter matching strudel's 4-color scheme
function highlightCode(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < code.length) {
    // check for $: pattern - light blue
    if (code[i] === '$' && code[i + 1] === ':') {
      tokens.push(
        <span key={key++} style={{ color: COLORS.blue }}>
          $:
        </span>
      );
      i += 2;
      continue;
    }

    // check for comments - grey
    if (code[i] === '/' && code[i + 1] === '/') {
      let end = i;
      while (end < code.length && code[end] !== '\n') end++;
      tokens.push(
        <span key={key++} style={{ color: COLORS.grey }}>
          {code.slice(i, end)}
        </span>
      );
      i = end;
      continue;
    }

    // check for brackets - grey
    if (/[()[\]{}]/.test(code[i])) {
      tokens.push(
        <span key={key++} style={{ color: COLORS.grey }}>
          {code[i]}
        </span>
      );
      i++;
      continue;
    }

    // check for /, ., , - light blue
    if (code[i] === '/' || code[i] === '.' || code[i] === ',') {
      tokens.push(
        <span key={key++} style={{ color: COLORS.blue }}>
          {code[i]}
        </span>
      );
      i++;
      continue;
    }

    // check for function/method names (word followed by open paren) - purple
    if (/[a-zA-Z_$]/.test(code[i])) {
      let end = i;
      while (end < code.length && /[a-zA-Z0-9_$]/.test(code[end])) end++;
      const word = code.slice(i, end);

      // check if followed by ( - it's a function call
      if (code[end] === '(') {
        tokens.push(
          <span key={key++} style={{ color: COLORS.purple }}>
            {word}
          </span>
        );
      } else {
        // regular identifier - green
        tokens.push(
          <span key={key++} style={{ color: COLORS.green }}>
            {word}
          </span>
        );
      }
      i = end;
      continue;
    }

    // strings - green
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let end = i + 1;
      while (end < code.length && code[end] !== quote) {
        if (code[end] === '\\') end++;
        end++;
      }
      end++;
      tokens.push(
        <span key={key++} style={{ color: COLORS.green }}>
          {code.slice(i, end)}
        </span>
      );
      i = end;
      continue;
    }

    // numbers - green
    if (/\d/.test(code[i])) {
      let end = i;
      while (end < code.length && /[\d.]/.test(code[end])) end++;
      tokens.push(
        <span key={key++} style={{ color: COLORS.green }}>
          {code.slice(i, end)}
        </span>
      );
      i = end;
      continue;
    }

    // everything else (operators, whitespace, etc.) - green
    tokens.push(
      <span key={key++} style={{ color: COLORS.green }}>
        {code[i]}
      </span>
    );
    i++;
  }

  return tokens;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const highlighted = useMemo(() => highlightCode(code), [code]);

  return (
    <pre className="font-mono text-[14px] leading-[1.4] whitespace-pre-wrap break-words" style={{ fontFamily: 'var(--font-geist-mono), monospace', color: '#fff' }}>
      {highlighted}
    </pre>
  );
}
