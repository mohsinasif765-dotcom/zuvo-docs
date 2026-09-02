import type { GuidePage } from "@/lib/types";

const guides: GuidePage[] = [
  {
    slug: ["getting-started"],
    title: "Getting started with Zuvo",
    description: "Create a project, connect your app, and open Zuvo Studio.",
    searchText:
      "getting started zuvo studio portal cli api keys project baas.zuvodev.com",
    body: `
## Overview

Zuvo gives every project an isolated Postgres stack with auth, storage, realtime, edge functions, and optional app hosting. Manage everything in **Zuvo Studio**.

## 1. Create an account

Sign up at [app.zuvodev.com](https://app.zuvodev.com) and create an organization.

## 2. Create a project

In [Zuvo Studio](https://studio.zuvodev.com), create a project. Zuvo provisions a dedicated tenant stack in your chosen region (EU or Singapore).

Your project API base URL looks like:

\`\`\`
https://<project-ref>.baas.zuvodev.com
\`\`\`

## 3. Get API keys

Open **Project Settings → API** in Studio. Use the **anon** key in client apps and the **service role** key only on trusted servers.

## 4. Install the Zuvo CLI

\`\`\`bash
npm i -g @zuvo/cli
zuvo login
zuvo link --project <project-ref>
\`\`\`

## 5. Connect from your app

Use \`@supabase/supabase-js\` pointed at your tenant URL and anon key — Zuvo is Postgres + Supabase-compatible APIs on your own subdomain.

## Next steps

- [Auth redirect URLs](/guides/auth/redirect-urls)
- [Row Level Security](/guides/database/postgres/row-level-security)
- [Edge Functions](/guides/functions)
- [App hosting](/guides/hosting)
`,
  },
  {
    slug: ["auth", "redirect-urls"],
    title: "Redirect URLs",
    description: "Configure allowed redirect URLs for auth flows in Zuvo.",
    searchText: "auth redirect urls gotrue site url oauth magic link",
    body: `
## Site URL

GoTrue uses a **Site URL** as the default redirect after sign-in. In Zuvo Studio open **Authentication → URL Configuration**.

Set **Site URL** to your production app origin, for example \`https://myapp.com\`.

## Additional redirect URLs

Add every origin that may complete auth flows:

- \`http://localhost:3000/**\` for local dev
- Preview URLs for staging
- Custom domains for production

Wildcards are supported where your auth configuration allows them.

## Email and magic links

Confirmation and magic-link emails embed redirect targets derived from these settings. If users land on an error page after clicking email links, the redirect URL is usually missing from the allow list.

## Zuvo-specific notes

- Portal confirmations may use \`app.zuvodev.com\`
- Tenant APIs live on \`*.baas.zuvodev.com\`
- Keep Studio **Site URL** aligned with the app users actually open after login
`,
  },
  {
    slug: ["auth", "auth-hooks"],
    title: "Auth hooks",
    description: "Extend GoTrue with hooks for email, SMS, and custom logic.",
    searchText: "auth hooks gotrue send email sms mfa custom",
    body: `
## What are auth hooks?

Auth hooks let you intercept GoTrue events (sign-up, sign-in, send email, etc.) and run custom HTTP endpoints before the default action proceeds.

## Common hooks on Zuvo

| Hook | Use case |
|------|----------|
| Send Email | Branded transactional mail via your provider |
| Send SMS | OTP / phone auth via your SMS API |
| Custom access token | Add claims to JWTs |

Configure hooks under **Authentication → Hooks** in Zuvo Studio, or via your tenant environment variables on the BAAS host.

## Send Email hook

Zuvo platform deployments often route the Send Email hook to the managed **zuvo-mailer** service. See [Send Email hook](/guides/auth/auth-hooks/send-email-hook).

## Security

- Use a shared secret between GoTrue and your hook endpoint
- Validate payload signatures
- Never log raw OTPs or magic links in production
`,
  },
  {
    slug: ["auth", "auth-hooks", "send-email-hook"],
    title: "Send Email hook",
    description: "How Zuvo delivers auth emails through the Send Email hook.",
    searchText: "send email hook gotrue mailer confirmation magic link",
    body: `
## Overview

When the Send Email hook is enabled, GoTrue POSTs the rendered template and metadata to your hook URL instead of sending mail itself.

On Zuvo, this typically targets the platform **zuvo-mailer** service integrated with your transactional email provider.

## Hook payload

GoTrue includes fields such as:

- \`user\` — email and metadata
- \`email_data\` — action type (signup, recovery, etc.)
- Template subject/body with variables like \`{{ .ConfirmationURL }}\`

Your hook must return \`200\` after the message is accepted for delivery.

## Custom templates

Set \`GOTRUE_MAILER_TEMPLATES_*_CONTENT\` in tenant config for branded HTML/text. The hook renderer substitutes confirmation URLs using your configured redirect URLs.

## Troubleshooting

- **Email not received** — check hook secret, mailer logs, and SPF/DKIM for your sending domain
- **Wrong redirect in link** — fix [Redirect URLs](/guides/auth/redirect-urls)
- **Hook 401** — rotate \`SEND_EMAIL_HOOK_SECRET\` in platform and tenant env together
`,
  },
  {
    slug: ["database", "postgres", "row-level-security"],
    title: "Row Level Security (RLS)",
    description: "Secure Postgres tables with RLS policies in Zuvo.",
    searchText: "row level security rls policies postgres auth.uid",
    body: `
## Enable RLS

\`\`\`sql
alter table public.profiles enable row level security;
\`\`\`

Without policies, RLS-enabled tables deny access (except superuser / service role).

## Example: users read own profile

\`\`\`sql
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = user_id);
\`\`\`

## Service role bypass

The **service role** key bypasses RLS. Use it only on trusted servers — never in browsers or mobile clients.

## Studio SQL editor

Run policies in **SQL Editor** or include them in migrations under \`supabase/migrations\` and push with \`zuvo db push\`.

## Advisors

Review **Database → Advisors** in Studio for common RLS mistakes (missing policies, overly permissive anon access).
`,
  },
  {
    slug: ["database", "postgres", "roles"],
    title: "Postgres roles",
    description: "Database roles, passwords, and connection strings on Zuvo.",
    searchText: "postgres roles passwords special symbols connection string pooler",
    body: `
## Default roles

Each Zuvo tenant includes standard Supabase-compatible roles (\`postgres\`, \`authenticator\`, \`anon\`, \`authenticated\`, \`service_role\`, etc.).

## Passwords

Rotate passwords from **Project Settings → Database** in Studio. After rotation, update connection strings in your apps and CI.

### Special symbols in passwords

If your password contains characters such as \`@\`, \`/\`, or \`#\`, URL-encode them in connection strings:

\`\`\`
postgresql://postgres:my%40pass@db.internal:5432/postgres
\`\`\`

## Pooler

Zuvo exposes Supavisor pooler endpoints for serverless and high-concurrency workloads. Use the pooler URI from Studio when deploying edge functions or serverless APIs.

## Direct connections

For migrations and admin tasks, prefer direct Postgres connections or Studio SQL editor rather than the transaction pooler.
`,
  },
  {
    slug: ["database", "migrations"],
    title: "Database migrations",
    description: "Version schema changes with SQL migrations and zuvo db push.",
    searchText: "migrations sql supabase migrations folder db push",
    body: `
## Migration files

Store ordered SQL files in \`supabase/migrations/\`:

\`\`\`
supabase/migrations/20260101000000_init.sql
\`\`\`

## Apply with Zuvo CLI

\`\`\`bash
zuvo link --project <ref>
zuvo db push
\`\`\`

## Best practices

- One logical change per migration file
- Always enable RLS on public tables exposed to PostgREST
- Test migrations on a branch/staging project before production
- Never edit applied migration files — add a new migration instead

## Studio

You can also run SQL manually in **SQL Editor**, but prefer migrations for reproducible deploys.
`,
  },
  {
    slug: ["database", "postgres", "functions"],
    title: "Database functions",
    description: "Create and manage Postgres functions in Zuvo.",
    searchText: "database functions plpgsql sql trigger",
    body: `
## Create functions

Define functions in SQL and expose them via PostgREST when granted to appropriate roles:

\`\`\`sql
create or replace function public.hello(name text)
returns text
language sql
security definer
set search_path = public
as $$
  select 'Hello ' || name;
$$;
\`\`\`

## Security definer

Use \`security definer\` carefully — set \`search_path\` explicitly and restrict execute grants.

## Migrations

Check functions into \`supabase/migrations\` and deploy with \`zuvo db push\`.
`,
  },
  {
    slug: ["database", "postgres", "triggers"],
    title: "Database triggers",
    description: "Automate data changes with Postgres triggers.",
    searchText: "triggers plpgsql after insert update delete",
    body: `
## Example trigger

\`\`\`sql
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
\`\`\`

## Auth-related triggers

Common pattern: insert a \`profiles\` row when \`auth.users\` gets a new user. Run trigger bodies with least privilege and validate \`NEW\` fields.
`,
  },
  {
    slug: ["storage"],
    title: "Storage",
    description: "File storage buckets and policies on Zuvo.",
    searchText: "storage buckets objects upload download s3 compatible",
    body: `
## Buckets

Create buckets in **Storage** in Zuvo Studio. Each bucket can be public or private.

## Upload from client

\`\`\`ts
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar.png', file)
\`\`\`

## Access control

Private buckets require RLS-style **storage policies**. See [Storage access control](/guides/storage/security/access-control).

## Limits

Storage quotas depend on your Zuvo plan. Monitor usage in Studio **Settings → Usage**.
`,
  },
  {
    slug: ["storage", "security", "access-control"],
    title: "Storage access control",
    description: "Storage policies for buckets and objects.",
    searchText: "storage policies rls buckets objects insert select delete",
    body: `
## Policy examples

Allow authenticated users to upload to their own folder:

\`\`\`sql
create policy "Users upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
\`\`\`

## Public buckets

Mark a bucket public in Studio only when every object in it is safe to cache on CDN.

## Testing

Use the Storage UI in Studio to verify uploads fail/ succeed under anon vs authenticated sessions.
`,
  },
  {
    slug: ["functions"],
    title: "Edge Functions",
    description: "Deploy serverless functions to your Zuvo tenant.",
    searchText: "edge functions deno deploy zuvo functions logs secrets",
    body: `
## Project layout

\`\`\`
supabase/functions/hello/index.ts
\`\`\`

## Deploy

\`\`\`bash
zuvo functions deploy
zuvo functions deploy hello
zuvo functions logs hello --since 6h
\`\`\`

## Secrets

\`\`\`bash
zuvo secrets set OPENAI_API_KEY=sk-...
zuvo secrets list
\`\`\`

Secrets are injected into the functions runtime for your tenant — not mixed with other projects.

## Local development

Use your tenant URL and anon key in \`.env.local\`. Functions run on the same isolated stack as the rest of your project.
`,
  },
  {
    slug: ["realtime"],
    title: "Realtime",
    description: "Subscribe to Postgres changes over websockets.",
    searchText: "realtime websocket postgres changes broadcast presence",
    body: `
## Subscribe to changes

\`\`\`ts
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => console.log(payload)
  )
  .subscribe()
\`\`\`

## Authorization

Realtime respects RLS — clients only receive events for rows they can read.

## Replication

Ensure tables are added to the \`supabase_realtime\` publication (Studio **Database → Publications** or SQL).
`,
  },
  {
    slug: ["hosting"],
    title: "App hosting",
    description: "Deploy frontend apps from GitHub on Zuvo hosting.",
    searchText: "app hosting github deploy domains zuvo hosting cli",
    body: `
## Create a hosting app

\`\`\`bash
zuvo hosting create --repo owner/my-app --name admin --deploy --wait
zuvo hosting apps
zuvo hosting logs --app my-app -f
\`\`\`

## Environment variables

\`\`\`bash
zuvo hosting env set API_URL=https://example.com
zuvo hosting deploy --wait
\`\`\`

## Custom domains

\`\`\`bash
zuvo hosting domains add app.example.com --app my-app
zuvo hosting domains verify app.example.com
\`\`\`

Apps receive URLs on \`*.app.zuvodev.com\` or your verified custom domain. See [pricing](https://zuvodev.com/pricing) for plan limits.
`,
  },
  {
    slug: ["cli", "getting-started"],
    title: "Zuvo CLI",
    description: "Command-line tool for migrations, functions, secrets, and hosting.",
    searchText: "zuvo cli login link db push functions secrets hosting",
    body: `
## Install

\`\`\`bash
npm i -g @zuvo/cli
\`\`\`

## Authenticate

\`\`\`bash
zuvo login
# or
zuvo login --token zpat_...
\`\`\`

## Link a project

\`\`\`bash
zuvo link --project <project-ref>
\`\`\`

## Common commands

| Command | Purpose |
|---------|---------|
| \`zuvo db push\` | Apply SQL migrations |
| \`zuvo functions deploy\` | Deploy edge functions |
| \`zuvo secrets set\` | Function secrets |
| \`zuvo hosting create\` | Create app hosting app |

Default API: \`https://api.zuvodev.com\` (override with \`ZUVO_API_URL\`).
`,
  },
  {
    slug: ["security", "advisors"],
    title: "Security advisors",
    description: "Review common Postgres and Auth misconfigurations in Studio.",
    searchText: "security advisors lints rls exposed tables auth",
    body: `
## Database advisors

Studio **Database → Advisors** surfaces lints such as:

- Tables exposed to \`anon\` without RLS
- Missing indexes on foreign keys
- Overly permissive policies

Fix issues in SQL migrations and redeploy with \`zuvo db push\`.

## Auth advisors

Review **Authentication → Configuration** for weak settings (open redirects, missing MFA for staff accounts, etc.).

## Production checklist

- RLS enabled on all public schema tables
- Service role key only on server
- Redirect URL allow list minimal
- Storage policies on private buckets
- Spend cap / usage alerts configured in Studio
`,
  },
];

export function allGuides(): GuidePage[] {
  return guides;
}

export function getGuide(slug: string[]): GuidePage | undefined {
  const key = slug.join("/");
  return guides.find((g) => g.slug.join("/") === key);
}

export function guidePath(slug: string[]): string {
  return `/guides/${slug.join("/")}`;
}
