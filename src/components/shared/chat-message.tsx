"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/websocket/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { type, content, displayName, clarifyingQuestions, timestamp } = message;

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (type === "system") {
    return (
      <div className="text-center text-xs text-muted-foreground py-1">
        {content}
      </div>
    );
  }

  if (type === "assistant") {
    return (
      <div className="bg-primary/10 rounded-lg p-3 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary">AI Assistant</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        {content && (
          <pre className="text-sm whitespace-pre-wrap font-mono bg-background/50 rounded p-2 mt-2 overflow-x-auto">
            {content}
          </pre>
        )}
        {clarifyingQuestions && clarifyingQuestions.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-muted-foreground">
              I need more information:
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              {clarifyingQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg p-3 mb-2",
        type === "user" ? "bg-secondary" : "bg-muted"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium">{displayName || "Anonymous"}</span>
        <span className="text-xs text-muted-foreground">{formattedTime}</span>
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
}
