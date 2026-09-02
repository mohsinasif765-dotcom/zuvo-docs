# Deploy on Vercel

1. Import this repo in [Vercel](https://vercel.com/new).
2. **Root Directory:** leave as repo root (`.`).
3. **Framework:** Next.js (auto-detected).
4. Add environment variables from [`env.example`](env.example):

   | Variable | Production value |
   |----------|------------------|
   | `NEXT_PUBLIC_DOCS_URL` | `https://docs.zuvodev.com` |
   | `NEXT_PUBLIC_STUDIO_URL` | `https://studio.zuvodev.com` |
   | `NEXT_PUBLIC_MARKETING_URL` | `https://zuvodev.com` |
   | `NEXT_PUBLIC_PORTAL_URL` | `https://app.zuvodev.com` |

5. Deploy. Point DNS **`docs.zuvodev.com`** to this Vercel project.

Studio uses `NEXT_PUBLIC_DOCS_URL=https://docs.zuvodev.com` — keep that URL in sync.

Local check:

```bash
npm install
npm run dev   # http://localhost:3001
npm run build
```
