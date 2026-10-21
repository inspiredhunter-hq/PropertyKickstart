# Supabase Change Log

Project: property-kickstart-data (`qhebnkhbbnzfxbzjbxfa`).

## 21 October 2026: Default permissions for future tables

**Reason:** Supabase announced that newly created tables in the public schema need explicit API access permissions from 30 October 2026.

**Applied migrations:**
- `secure_public_future_object_defaults_20261021`
- `harden_future_public_table_sequence_defaults_20261021`

**Scope:** Removed default grants to API roles on future tables, functions and sequences created by the postgres role in the public schema. Existing objects and data were not modified.

**Verification:** Queried PostgreSQL default access privileges after both migrations. No automatic grants remained for API roles on future objects created by postgres in public. All 17 existing public tables had Row Level Security enabled; none allowed anonymous SELECT.

**Development standard:** [Supabase Data API grants](supabase-data-api-grants-2026.md).

**Remaining checks:** Review all application code paths creating tables, confirm permissions for any other table-creating roles, and run end-to-end API tests. Security adviser findings for tables with RLS but no policies require individual assessment before changing access.

**Rollback:** Reinstating broad automatic grants is not advised. If a feature needs API access, issue narrowly scoped explicit grants and implement relevant RLS policies.

## Change control

For each future change, record its date, linked ACT, reason, migration or commit, affected objects, verification evidence, outcome and rollback approach. Do not mark unverified work complete.
