# Grand MF Arena — Inventory, Ordering, Sales & Remittance

Next.js 15 · TypeScript · Tailwind · PostgreSQL · Prisma · JWT cookie auth (jose + bcryptjs)

## Local setup
```bash
npm install
cp .env.example .env        # fill DATABASE_URL, DIRECT_URL, AUTH_SECRET
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```
Seeded logins (change passwords in `.env` before seeding):
- Admin: `admin@grandmfarena.ph`
- Stores: `sugbabs@`, `rouxster@`, `egoy@`, `vins@`, `gmd@` + `grandmfarena.ph`

## Deploy to Vercel
1. Create a Postgres database (Neon, Supabase, or Vercel Postgres) and copy the pooled and direct URLs.
2. Commit the `prisma/migrations` folder created by `prisma migrate dev`.
3. Push to GitHub and import the repo in Vercel.
4. Add env vars: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (`openssl rand -base64 32`).
5. Set the Build Command to `npm run vercel-build` (runs `prisma migrate deploy`).
6. Seed once from your machine against the production DB: `DATABASE_URL=... DIRECT_URL=... npm run db:seed`.

## Security model
- `middleware.ts` gates `/admin` and `/store` by role; every page and action re-checks with `requireAdmin()` / `requireStore()`.
- Store data is always filtered by `storeId` taken from the signed session, never from URL params.

## Build status
- [x] Step 1: structure, schema, auth, roles, dashboards, navigation
- [ ] Step 2: Events, Products, Categories, Stock Receiving, Inventory
- [ ] Step 3: Store ordering (catalog, cart, orders) and admin order processing
- [ ] Step 4: Sales, Remittance (per event and store, merged products), Event summary
- [ ] Step 5: Reports with filters and print, Activity Logs, Settings
