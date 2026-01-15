'use client';

import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BotMessageSquare } from 'lucide-react';
import type { Strudel } from '@/lib/api/strudels/types';

interface StrudelCardProps {
  strudel: Strudel;
  actions?: ReactNode;
  showDescription?: boolean;
  showCodePreview?: boolean;
  maxTags?: number;
}

export function StrudelCard({
  strudel,
  actions,
  showDescription = false,
  showCodePreview = false,
  maxTags = 3,
}: StrudelCardProps) {
  return (
    <Card className="rounded-md gap-2">
      <CardHeader className="relative">
        {actions && <div className="absolute -top-1 right-4 flex gap-1">{actions}</div>}
        <CardDescription>
          {new Date(strudel.updated_at).toLocaleDateString()}
        </CardDescription>
        <CardTitle className="text-lg truncate max-w-[70%]">{strudel.title}</CardTitle>
        {showDescription && strudel.description && (
          <CardDescription className="truncate max-w-[75%] -mt-1">
            {strudel.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {showCodePreview && strudel.code && (
          <pre className="text-xs bg-zinc-900/50 p-4 rounded overflow-hidden line-clamp-10 leading-5 text-muted-foreground">
            {strudel.code}
          </pre>
        )}

        <div className="flex gap-1 overflow-hidden">
          {strudel.ai_assist_count > 0 && (
            <span className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
              <BotMessageSquare className="h-3.5 w-3.5" />
              {strudel.ai_assist_count}
            </span>
          )}
          {strudel.tags?.slice(0, maxTags).map(tag => (
            <span
              key={tag}
              className="text-xs bg-secondary px-2 py-0.5 rounded truncate max-w-24">
              {tag}
            </span>
          ))}
          {strudel.tags && strudel.tags.length > maxTags && (
            <span className="text-xs text-muted-foreground px-1 shrink-0">
              +{strudel.tags.length - maxTags}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
