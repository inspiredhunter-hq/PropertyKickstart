# Supabase Data API grants for new tables (from 30 October 2026)

Project: `property-kickstart-data` (`qhebnkhbbnzfxbzjbxfa`).

## Required rule for every migration creating a table

1. Create the table.
2. Enable row level security (RLS) before granting any client API access.
3. Grant **only** the permissions the feature requires, in the same migration.
4. Create and test row-specific RLS policies for any `anon` or `authenticated` access.
5. For server-only tables, grant only `service_role` privileges, as appropriate.
6. Test authorized operations, rejected unauthorized operations, and no regression in the existing application.

Example for a server-only table:

```sql
create table public.example_internal (
  id uuid primary key default gen_random_uuid()
);
alter table public.example_internal enable row level security;
grant select, insert, update, delete
  on public.example_internal to service_role;
```

Example for an authenticated user's own records (adapt column design to the feature):

```sql
create table public.example_own_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id)
);
alter table public.example_own_records enable row level security;
grant select, insert on public.example_own_records to authenticated;
create policy "read own" on public.example_own_records
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own" on public.example_own_records
  for insert to authenticated with check ((select auth.uid()) = user_id);
```

Never grant `anon` access to investor contact information or internal property data without a specifically reviewed requirement. Do not put a `service_role` key in browser code. Public-facing registration should pass through an authorised and validated server endpoint, not an unrestricted client table grant.

## Existing change and verification

On 21 October 2026, Supabase migrations `secure_public_future_object_defaults_20261021` and `harden_future_public_table_sequence_defaults_20261021` were applied to revoke default API role grants on **future** `public` objects created by role `postgres`. They do **not** change the existing tables. Verify defaults and security advisors on each future release.

The Supabase security advisor found RLS enabled but no RLS policies on some internal tables. Such tables can be intentionally service-only, and must be evaluated based on application needs before policies are added.

Reference: https://supabase.com/docs/guides/api/securing-your-api
