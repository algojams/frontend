'use client';

import { Highlight, themes } from 'prism-react-renderer';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import type { AgentMessage } from '@/lib/types/strudel';
import Link from 'next/link';
import { useAIMessage, formatTime, STRUDEL_BASE_URL, STRUDEL_DOCS_URL } from './hooks';

interface AIMessageProps {
  message: AgentMessage;
  onApplyCode?: (code: string) => void;
}

const USER_COLOR = 'text-emerald-400';
const ASSISTANT_COLOR = 'text-blue-400';

export function AIMessage({ message, onApplyCode }: AIMessageProps) {
  const {
    role,
    content,
    is_code_response,
    is_streaming,
    clarifying_questions,
    strudel_references,
    doc_references,
    created_at,
  } = message;

  const displayContent = content || (
    clarifying_questions?.length
      ? `I need a bit more info:\n${clarifying_questions.map(q => `- ${q}`).join('\n')}`
      : ''
  );

  const { copied, applied, handleCopy, handleApply } = useAIMessage(displayContent, onApplyCode);
  const formattedTime = formatTime(created_at);

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="rounded-lg rounded-br-none bg-transparent border border-muted/40 p-3 w-fit max-w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium text-[12px] ${USER_COLOR}`}>You</span>
            {formattedTime && (
              <span className="text-muted-foreground/60 text-[10px]">{formattedTime}</span>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="rounded-lg rounded-bl-none bg-transparent border border-muted/40 p-3 w-full max-w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-[12px] ${ASSISTANT_COLOR}`}>Assistant</span>
          {formattedTime && (
            <span className="text-muted-foreground/60 text-[10px]">{formattedTime}</span>
          )}
          {is_streaming && (
            <span className="text-muted-foreground/60 text-[10px] animate-pulse">typing...</span>
          )}
        </div>

        {is_code_response ? (
          <div className="relative group">
            <Highlight theme={themes.oneDark} code={displayContent} language="javascript">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} text-xs overflow-x-auto rounded-md`} style={style}>
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
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 text-xs">
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              {onApplyCode && (
                <Button size="sm" onClick={handleApply} className="h-7 text-xs">
                  {applied ? <Check className="h-3 w-3 mr-1" /> : null}
                  {applied ? 'Applied' : 'Apply to editor'}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}

        {(strudel_references?.length || doc_references?.length) ? (
          <div className="mt-3 pt-2 border-t border-muted/30 space-y-1">
            {strudel_references?.map(ref => (
              <Link
                key={ref.id}
                href={ref.url}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
                {ref.title} by {ref.author_name}
              </Link>
            ))}
            {doc_references?.map((ref, i) => (
              <a
                key={i}
                href={ref.url || STRUDEL_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
                {ref.section_title || ref.page_name}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
