# Zuvo Docs

Standalone documentation site for [Zuvo](https://zuvodev.com) — same pattern as [`zuvo-landing`](../zuvo-landing).

Public URL: **https://docs.zuvodev.com**

Studio links here via `NEXT_PUBLIC_DOCS_URL`. Paths match Studio contextual help (`/guides/...`).

## Local dev

```bash
cd zuvo-docs
npm install
npm run dev
# → http://localhost:3001
```

## Build

```bash
npm run build
npm start
```

Typical laptop RAM is enough (unlike the legacy Supabase monorepo fork).

## Deploy

### Vercel (recommended — same as Studio)

```bash
chmod +x ../brand/deploy-docs-vercel.sh
# Set env from env.example in Vercel project → docs.zuvodev.com
../brand/deploy-docs-vercel.sh
```

### Docker / EU VM

```bash
docker compose --profile docs up -d zuvo-docs   # from baas/base
```

## Add a guide

1. Add content in [`lib/content/guides/index.ts`](lib/content/guides/index.ts)
2. Add sidebar entry in [`lib/guide-registry.ts`](lib/guide-registry.ts)
3. Rebuild / redeploy

Unknown `/guides/*` URLs show a “coming soon” stub — never Supabase links.

## Legacy vendor fork

The heavy Supabase `apps/docs` fork scripts remain under [`brand/`](../brand/) (`fetch-supabase-docs-src.sh`, `build-zuvo-docs.sh`) but are **not** the primary docs path anymore.
