# Frontend-only mode

Algopatterns runs entirely in the browser. No backend server is required.

## AI features

AI uses **BYOK** (bring your own key). Add an Anthropic or OpenAI API key in **Settings**. Requests go directly from your browser to the provider.

## Storage

- **Drafts** — auto-saved work in progress (`localStorage`)
- **Shelf** — saved strudels (`localStorage`, `local_*` IDs)
- **Settings** — API key and preferences (`localStorage`)

## Development

```bash
pnpm install
pnpm dev
```

## Deploy

Deploy to [Vercel](https://vercel.com) by connecting the repo. No environment variables required for the core editor. Vercel builds on push — no GitHub Actions needed.
