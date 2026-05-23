# LinkVault — API-first Linktree alternative

A multi-user link-in-bio platform where each user gets a public page at `/username`, plus a personal API key to manage their links programmatically. Noir editorial aesthetic with per-user theme customization and "highlight" (featured) link support.

## Core features

### Public profile page (`/$username`)
- Avatar, display name, bio, social handles
- Vertical stack of link cards
- Featured/highlighted links get the gradient-bordered treatment from the chosen direction
- Background glow + serif-italic name from the Noir Editorial design
- Click-through tracked server-side (counts only — no PII)

### Authenticated dashboard (`/app`)
- Email/password + Google sign-in
- Edit profile (name, bio, avatar upload)
- CRUD links: title, URL, optional emoji/icon, "featured" toggle, drag-to-reorder
- Theme picker: 4-6 presets (Noir, Bone, Indigo Mist, Sunset, Forest, Mono) — each swaps `--brand-bg`, `--brand-surface`, `--brand-accent`, `--brand-text`
- API keys panel: generate, label, copy once, revoke. Show key prefix + last-used timestamp afterwards.

### Public REST API (`/api/public/v1/*`)
Bearer-token authenticated using the user's API key (stored hashed). All endpoints scoped to the key's owner.

- `GET  /api/public/v1/me` — profile + theme + links
- `GET  /api/public/v1/links` — list links
- `POST /api/public/v1/links` — create link `{ title, url, featured?, position? }`
- `PATCH /api/public/v1/links/:id` — update any field
- `DELETE /api/public/v1/links/:id` — remove
- `PUT  /api/public/v1/links` — bulk replace entire list (great for scripting)

All requests rate-limited per key. Zod validation on every body.

### Landing page (`/`)
Marketing page explaining the product, "Claim your handle" CTA → signup, and a code snippet showing the API in action.

## Architecture

```text
src/routes/
  index.tsx                     -> marketing landing
  login.tsx                     -> sign in
  signup.tsx                    -> claim username + create account
  $username.tsx                 -> public profile (SSR-friendly)
  _authenticated.tsx            -> auth gate
  _authenticated/app.tsx        -> dashboard shell (sidebar)
  _authenticated/app.links.tsx  -> link CRUD + reorder
  _authenticated/app.profile.tsx-> profile + theme picker
  _authenticated/app.api.tsx    -> API key management
  api/public/v1/me.ts           -> server route
  api/public/v1/links.ts        -> GET, POST, PUT
  api/public/v1/links.$id.ts    -> PATCH, DELETE
  r/$linkId.ts                  -> redirect + click tracking
```

## Data model (Lovable Cloud)

- `profiles` — id (FK auth.users), username (unique, citext), display_name, bio, avatar_url, theme (text enum), socials (jsonb)
- `links` — id, user_id, title, url, featured (bool), position (int), click_count (int), created_at
- `api_keys` — id, user_id, label, key_hash (sha256), key_prefix (first 8 chars, shown in UI), last_used_at, created_at, revoked_at

RLS: users read/write only their own rows. Public profile read happens via a `createServerFn` using `supabaseAdmin` filtered by `username` (returns only safe columns).

## Technical details

- **Auth**: Lovable Cloud email/password + Google. `_authenticated` layout guards `/app/*`.
- **API key format**: `lv_live_<32 random chars>`. Hashed with SHA-256 before storage; raw value shown once at creation.
- **API route security**: Routes under `/api/public/v1/*` parse `Authorization: Bearer <key>`, look up by hash via `supabaseAdmin`, update `last_used_at`, then proceed. Reject missing/invalid keys with 401.
- **Reordering**: `position` integer with gap-based ordering; bulk reorder endpoint.
- **Themes**: stored as enum string; CSS variables defined in `styles.css`, swapped via `data-theme="..."` attribute on the public profile root.
- **Click tracking**: `/r/:linkId` server route increments `click_count` then `302`s to target URL.
- **Validation**: Zod schemas shared between server routes and dashboard forms (URL format, title ≤120 chars, username regex `^[a-z0-9_]{3,30}$`).

## Out of scope (v1)
- Detailed analytics dashboard (only total click count per link)
- Custom domains
- Payment integration / paid tiers
- Webhook events

## Build order
1. Enable Lovable Cloud + schema (profiles, links, api_keys) + RLS
2. Auth flow (signup with username claim, login, Google)
3. Public profile page `/$username` with Noir Editorial design + theme support
4. Dashboard: profile editor, links CRUD with reorder, theme picker
5. API keys UI + public REST API routes
6. Landing page + click-tracking redirect
