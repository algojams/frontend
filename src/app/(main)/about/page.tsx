import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Algorave',
  description:
    'Learn about Algorave, an open-source collaborative live coding music platform powered by Strudel.',
  openGraph: {
    title: 'About | Algorave',
    description:
      'Learn about Algorave, an open-source collaborative live coding music platform.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">About Algorave</h1>
      <p className="text-muted-foreground mb-8">
        Algorave is a collaborative live coding music platform that lets you create music
        by writing code. Built on top of{' '}
        <a
          href="https://strudel.cc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline">
          Strudel
        </a>
        , a powerful pattern language for music, Algorave adds real-time collaboration, AI
        assistance, and community features.
      </p>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
            <li>Live code music in your browser using the Strudel pattern language</li>
            <li>Real-time collaboration with friends in live sessions</li>
            <li>AI-assisted code generation to help you explore new patterns</li>
            <li>Save, share, and fork patterns from the community</li>
            <li>
              Extensive sample library including drum machines, synths, and soundfonts
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Open Source</h2>
          <p className="text-muted-foreground">
            Algorave is fully open source under the AGPL-3.0 license. We believe in the
            power of open collaboration and welcome contributions from the community.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/algoraveai"
                target="_blank"
                rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Learn Strudel</h2>
          <p className="text-muted-foreground">
            New to live coding? Strudel has excellent documentation and tutorials to get
            you started.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" asChild>
              <a
                href="https://strudel.cc/workshop/getting-started"
                target="_blank"
                rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Strudel Workshop
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://strudel.cc/learn/intro"
                target="_blank"
                rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </a>
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Get Started</h2>
          <p className="text-muted-foreground">
            Ready to make some music? Jump into the editor and start creating.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild>
              <Link href="/">Start Coding</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/explore">Explore Patterns</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
