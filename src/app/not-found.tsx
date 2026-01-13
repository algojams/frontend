import { Button } from '@/components/ui/button';
import { Home, Music } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go home
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/explore">
              <Music className="h-4 w-4 mr-2" />
              Explore strudels
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
