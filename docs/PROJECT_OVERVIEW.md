# SubTrack — Project Overview

> A personal reference document describing what was built, how it is architected,
> and why it is worth showing. This file lives under `docs/` and has no impact on
> the running application code.

---

## 1. What Exactly Was Built

**SubTrack** is a modern, fully-functional web application for managing monthly
subscriptions and recurring bills from a single dashboard. It started as a
frontend-only academic project (mock data + `localStorage`) and was progressively
upgraded into a cloud-backed SaaS product with real authentication, per-user
data, an AI assistant, and an onboarding experience.

The application lets a user:

- Sign up / sign in with email+password or Google.
- Add, edit, delete, and manage recurring subscriptions with auto-matched brand logos.
- See live spending statistics, trends, category breakdowns, and a health score.
- Track upcoming renewals on a monthly calendar.
- Receive data-driven insights and recommendations to optimize spend.
- Switch currency, theme, and notification preferences (saved to their account).
- Chat with an in-app AI assistant that guides them and suggests optimizations.
- Go through a 3-step first-run onboarding walkthrough.

A preloaded **demo account** exists for quick showcase:
`demo@subtrack.app` / `SubTrackDemo2026!` (14 sample subscriptions).

---

## 2. Architecture

### Routing & Layout

The app uses **TanStack Router** (file-based routing) on **TanStack Start v1** with
SSR-capable rendering and Vite 8 as the build tool.

```
src/routes/
├── __root.tsx                  # Root: QueryClient, Supabase auth listener, global head/meta, error + 404 boundaries
├── index.tsx                   # Public landing page (redirects to /dashboard if signed in)
├── auth.tsx                    # Sign in / sign up (email + Google OAuth)
├── forgot-password.tsx         # Password reset request
├── reset-password.tsx          # Password reset confirmation
├── _shell.tsx                  # Protected layout: auth gate, sidebar, topnav, toaster, onboarding, chat
├── _shell.dashboard.tsx        # Stats, charts, renewals, insights
├── _shell.subscriptions.tsx    # Subscriptions parent route
├── _shell.subscriptions.index  # Subscriptions grid (search, filter, edit, delete)
├── _shell.subscriptions.add    # Add subscription form
├── _shell.calendar.tsx         # Monthly renewal calendar with modals
├── _shell.analytics.tsx        # Trend, category, projection charts
├── _shell.insights.tsx         # Dynamic recommendation cards
├── _shell.profile.tsx          # Profile + preferences
└── api/chat.ts                 # AI chat backend (streaming server route)
```

- `__root.tsx` wraps the app in `QueryClientProvider` and listens to Supabase
  auth state changes, invalidating queries + router on sign-in/out.
- `_shell.tsx` is the **protected layout**. Its `beforeLoad` calls
  `supabase.auth.getUser()` and redirects unauthenticated users to `/auth` with a
  `next` redirect parameter. All authenticated pages render inside it via `<Outlet />`.

### Data & State

- **Supabase (Lovable Cloud)** is the backend: Postgres database + Auth + Row
  Level Security.
- Two user-scoped tables: `profiles` and `subscriptions`, each with RLS policies so
  a user can only read/write their own rows.
- A `handle_new_user()` trigger auto-creates a `profiles` row on signup.
- `useSubscriptions` hook (`src/hooks/useSubscriptions.ts`) performs all CRUD
  against Supabase and exposes `add`, `update`, `remove`, `reset`, `refresh`, and
  `seedSamples`.
- `useProfileIdentity` hook syncs display name / email across tabs.
- Currency is a reactive store (`src/lib/currency.ts`) persisted locally and
  consumed app-wide.
- `src/lib/derive.ts` computes all derived metrics **from real subscription data**:
  monthly spend, 6-month trend, projection, category breakdown, potential savings,
  duplicate-category detection, health score, and the dynamic insights engine.

### Auth & Security

- Email/password and Google OAuth via Supabase Auth.
- `requireSupabaseAuth` middleware + client-side bearer attacher for server functions.
- Protected routes redirect to `/auth`; auth callback handles session hydration
  then navigates to the intended `next` path.
- RLS enforced at the database level — no client can read another user's data.

### AI Assistant

- `src/routes/api/chat.ts` is a TanStack server route that streams responses from
  **Google Gemini** via the Lovable AI Gateway (OpenAI-compatible SDK).
- A detailed system prompt teaches the assistant the app's features and its role
  as a spending-optimization expert.
- The client injects the user's live subscription data + currency as context, so
  responses include specific named services and figures.
- `ChatWidget` (`src/components/subtrack/ChatWidget.tsx`) is a floating bottom-right
  bubble that expands into a full chat window with markdown rendering, "thinking"
  states, and quick-start suggestions.

---

## 3. Features

### Core Pages

1. **Landing Page** — Hero, features, dashboard preview, footer. Redirects
   signed-in users straight to the dashboard.
2. **Authentication** — Split-screen sign in / sign up with email + Google,
   password recovery, and reset flows.
3. **Dashboard** — Live stat cards (monthly spend, active count, upcoming
   renewals, potential savings, health score), spending trend line chart, category
   donut chart, upcoming renewals list, recent insights.
4. **My Subscriptions** — Searchable / filterable grid or table with brand logos,
   category, amount, billing cycle, renewal date, status; edit + delete with
   confirmation and undo.
5. **Add Subscription** — Validated form; logos resolved automatically from the
   service name via `simple-icons` (no manual upload).
6. **Calendar** — Monthly view highlighting renewal dates; clicking a date opens a
   modal listing due subscriptions.
7. **Analytics** — Monthly trend, category breakdown, yearly projection, top
   spending categories (Recharts).
8. **Insights** — Dynamically generated recommendation cards (unused services,
   duplicates, renewals due, savings, yearly-budget reminders) with actionable
   buttons that cancel subscriptions or navigate to relevant pages.
9. **Profile** — Display name, email, theme toggle (dark mode), currency selector
   (INR / USD / EUR / GBP), notification preferences — all synced to the cloud.

### Cross-Cutting

- **3-step onboarding walkthrough** shown once per new account (add first
  subscription → review renewals → set preferences), with skip + quick-jump.
- **AI chat assistant** floating widget, context-aware with live data.
- **Global loading states** — branded `FullPageLoader` and per-route skeletons
  during data fetches and route transitions.
- **Empty state** — new users on an empty dashboard can one-click load sample data.
- **Auto brand logos** — `SubLogo` resolves SVG brand icons via normalized names +
  aliases (e.g. "YouTube Premium" → YouTube icon), with initials fallback.
- **Dynamic notifications** — TopNav shows upcoming renewals within 7 days and
  user initials from the profile.
- **Responsive layout** — sidebar collapses to a mobile drawer; all pages adapt.
- **Dark mode** — applied globally with no hydration flash.
- **SEO** — per-route head metadata, OpenGraph / Twitter cards, semantic HTML.

---

## 4. Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | TanStack Start v1 (React 19, SSR/SSG)                             |
| Router           | TanStack Router (file-based)                                      |
| Build tool       | Vite 8                                                            |
| Language         | TypeScript                                                        |
| Styling          | Tailwind CSS v4 (native `@import` + theme tokens)               |
| UI primitives    | shadcn/ui + Radix UI, Lucide icons                               |
| Charts           | Recharts                                                          |
| Brand icons      | `simple-icons`                                                    |
| Forms            | React Hook Form + Zod                                            |
| Data fetching    | TanStack Query                                                    |
| Backend          | Lovable Cloud (Supabase) — Postgres, Auth, RLS, Storage           |
| Auth             | Email/password + Google OAuth, `@lovable.dev/cloud-auth-js`       |
| AI               | Google Gemini via Lovable AI Gateway (Vercel AI SDK streaming)    |
| Notifications    | Sonner toasts                                                     |
| Deployment       | Lovable (Cloudflare Workers edge runtime)                         |

---

## 5. Project Outcome

The project evolved from a static mock prototype into a **production-grade,
cloud-synced SaaS application**:

- Every interaction is real — add, edit, delete, search, filter, currency/theme
  switching, and insights all operate on live per-user database records.
- New users get a guided first-run experience and a one-click starter dataset.
- An AI assistant provides concrete, data-backed guidance rather than generic tips.
- All data is secured behind authentication and row-level security.
- The UI is polished, responsive, animated, and accessible — built to a "Modern
  SaaS minimalist" design standard (Linear / Stripe / Vercel inspiration).

It demonstrates a complete product loop: marketing landing → signup → onboarding
→ daily use → optimization insights → AI guidance, all in one coherent app.

---

## 6. What Makes It Worth Showing

- **End-to-end functionality, not just mockups.** Every button, form, and chart is
  wired to real cloud data and real auth — nothing is a dead placeholder.
- **Data-driven intelligence.** Insights, health score, savings, and projections
  are all computed live from the user's actual subscriptions — they change as the
  data changes.
- **Built-in AI assistant** that understands the product *and* the user's real
  spend, giving specific named-subscription advice.
- **Polished UX details** — animated onboarding, loading skeletons, empty states,
  undo on delete, auto brand logos, cross-tab profile sync, no hydration flashes.
- **Secure by design** — protected routes, RLS-isolated per-user data, managed
  auth with Google + password recovery.
- **Clean, modular architecture** — thin server functions, typed data layer,
  reusable components, and a derive engine that keeps business logic testable and
  separate from UI.
- **Academic-to-real-world trajectory** — started as a frontend-only course
  project and grew into a deployable SaaS, making it a compelling portfolio piece
  that shows both design taste and full-stack maturity.
