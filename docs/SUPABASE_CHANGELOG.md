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


## 21 October 2026: Follow-up verification

**Repository inspection:** Inspected default-branch file trees for PropertyKickstart, PropertyKickstart-Register, PropertyKickstart-EPC and PropertyKickstart-HMLR. The registration function uses Notion rather than Supabase; the EPC and workbook functions did not show Supabase table-creation paths. HMLR contains Supabase architecture descriptions, but its repository does not contain a visible SQL migration directory. This is not a certification of every external automation or deployment.

**Repeated database verification:** 17 public tables, all 17 with RLS enabled. No public tables are SELECT-readable by either anon or authenticated roles. The postgres role's future public table, function and sequence defaults remain restricted.

**Additional finding:** The supabase_admin role retains broad automatic defaults in the public schema. Do not change Supabase's platform administration role blindly; first confirm whether it actually creates application tables and whether a change would affect Supabase-managed operations.

**Security adviser review:** 64 informational RLS-without-policy findings (seven in public) and one public function search-path warning. Seven public tables without policies also have no anon/authenticated SELECT grants, so no policies were added without an access requirement. The function warning is a separate hardening item and not caused by the 30 October grant change.

**Verification boundary:** SQL metadata checks and application source inspection are complete. No live signup was created and no deployment or end-to-end role-authenticated API test was executed; do not describe those as passed.

**Disposition:** The 30 October Supabase notification has been addressed for migrations run as postgres. Independent application integration tests and broader security-lint remediation should be tracked as separate engineering work, not silently marked complete.
