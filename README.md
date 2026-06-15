# Algopatterns Frontend

Browser-based Strudel playground with optional BYOK AI assistance. Runs entirely on the client — no backend required.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Import this repo in [Vercel](https://vercel.com/new)
2. No environment variables required for the editor
3. Deploy from the `feat/frontend-only` branch (or merge to your default branch)

Vercel builds on git push — no GitHub Actions or Docker needed.

## AI

Add an Anthropic or OpenAI API key in **Settings** to enable the AI assistant. Keys stay in your browser and requests go directly to the provider.

## Storage

Patterns and drafts are saved in `localStorage` in your browser.
