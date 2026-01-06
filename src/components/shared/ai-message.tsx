'use client';

import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import type { AgentMessage } from '@/lib/api/strudels/types';

interface AIMessageProps {
  message: AgentMessage;
  onApplyCode?: (code: string) => void;
}

export function AIMessage({ message, onApplyCode }: AIMessageProps) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const { role, content, is_code_response, clarifying_questions, created_at } = message;

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!content || !onApplyCode) return;
    onApplyCode(content);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const formattedTime = created_at
    ? new Date(created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  if (role === 'user') {
    return (
      <div className="rounded-sm bg-black/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-rose-300/70 text-[12px]">You</span>
          {formattedTime && (
            <span className="text-muted-foreground text-[10px]">{formattedTime}</span>
          )}
        </div>
        <p className="text-foreground/70 text-[13px]">{content}</p>
      </div>
    );
  }

  // assistant message
  return (
    <div className="rounded-sm bg-black/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-teal-300/70 text-[12px]">Assistant</span>
        {formattedTime && (
          <span className="text-muted-foreground text-[10px]">{formattedTime}</span>
        )}
      </div>

      {content && (
        <>
          {is_code_response ? (
            <>
              <Highlight
                theme={themes.duotoneDark}
                code={`/* generated */\n\n${content}`}
                language="javascript">
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className="whitespace-pre-wrap font-mono overflow-x-auto grayscale-100 text-[13px]"
                    style={{
                      ...style,
                      background: 'transparent',
                      backgroundColor: 'transparent',
                    }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-24 text-xs text-foreground/70 hover:text-rose-300/50 focus:text-emerald-300/50 bg-accent/30"
                  onClick={handleApply}>
                  {applied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Applied
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-24 text-xs text-foreground/70 hover:text-rose-300/50 focus:text-emerald-300/50"
                  onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="whitespace-pre-wrap text-foreground/70 text-[13px]">
              {content}
            </p>
          )}
        </>
      )}

      {clarifying_questions && clarifying_questions.length > 0 && (
        <div className="space-y-1 mt-1">
          <p className="text-muted-foreground text-[10px]">I need more information:</p>
          <ul className="list-disc list-inside space-y-1 text-foreground/70 text-xs">
            {clarifying_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
