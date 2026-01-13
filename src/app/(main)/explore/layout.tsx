import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore | Algorave',
  description: 'Discover and fork live coding patterns created by the Algorave community. Find inspiration for your next musical creation.',
  openGraph: {
    title: 'Explore | Algorave',
    description: 'Discover and fork live coding patterns created by the Algorave community.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Explore | Algorave',
    description: 'Discover and fork live coding patterns created by the Algorave community.',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
