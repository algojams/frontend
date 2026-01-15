'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          // success - green
          '--success-bg': 'var(--popover)',
          '--success-text': 'var(--popover-foreground)',
          '--success-border': 'oklch(0.7 0.15 145)',
          // error - red
          '--error-bg': 'var(--popover)',
          '--error-text': 'var(--popover-foreground)',
          '--error-border': 'oklch(0.65 0.2 25)',
          // warning - yellow
          '--warning-bg': 'var(--popover)',
          '--warning-text': 'var(--popover-foreground)',
          '--warning-border': 'oklch(0.75 0.15 85)',
          // info - blue
          '--info-bg': 'var(--popover)',
          '--info-text': 'var(--popover-foreground)',
          '--info-border': 'oklch(0.7 0.15 240)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
