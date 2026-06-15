'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/lib/stores/ui';

export function Header() {
  const pathname = usePathname();
  const { setDraftsModalOpen, setSettingsModalOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          /||\ <span className='sm:inline-block hidden'>ALGOPATTERNS</span>
        </Link>

        <nav className="ml-6 flex items-center gap-4 text-sm">
          <Link
            href="/shelf"
            className={pathname === '/shelf' ? 'text-foreground/90' : 'text-muted-foreground hover:text-foreground transition-colors'}>
            Shelf
          </Link>

          <Link
            href="/about"
            className={pathname === '/about' ? 'text-foreground/90' : 'text-muted-foreground hover:text-foreground transition-colors'}>
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem
                onClick={() => setDraftsModalOpen(true)}
                className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Drafts
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSettingsModalOpen(true)}
                className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
