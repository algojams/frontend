'use client';

import Link from 'next/link';
import { SamplesPanel } from '../samples-panel';
import { Headphones } from 'lucide-react';

export function SidebarPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 h-12 px-3 border-t border-b shrink-0">
        <Headphones className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Samples</span>
      </div>

      <div className="flex-1 min-h-0 bg-background overflow-hidden rounded-bl-xl">
        <SamplesPanel />
      </div>

      <div className="h-16 shrink-0 bg-background flex items-center justify-center border-t">
        <div className="flex items-center gap-4 opacity-80">
          <Link
            href="/about"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ABOUT
          </Link>
          <a
            href="https://github.com/algopatterns/frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            GITHUB
          </a>
          <a
            href="https://strudel.cc/workshop/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            DOCS
          </a>
        </div>
      </div>
    </div>
  );
}
