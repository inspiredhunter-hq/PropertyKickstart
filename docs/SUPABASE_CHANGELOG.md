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


## 21 October 2026: Final change-notification closure review

**Status: CLOSED for the 30 October 2026 Data API default-grants notice.**

Evidence:
- Confirmed the two change migrations in `supabase_migrations.schema_migrations`.
- Rechecked future public object defaults for the `postgres` role: no automatic API-role privileges on tables, sequences, or functions.
- Confirmed that all 17 current public tables belong to `postgres`, have RLS enabled, deny client-role grants and retain service-role access.
- Reviewed RLS policy metadata: ten tables have explicit client-deny policies; the remaining seven have no client grants and therefore do not require a new client-access policy for this change.
- Reviewed source for the connected site, register and EPC functions. The registration backend uses Notion, not Supabase. The HMLR repository describes Supabase integration but does not contain a visible migration directory. New future integrations must follow the explicit-grants development standard.
- The `supabase_admin` role retains platform-defined defaults. All existing public tables are owned by `postgres`; no change to this Supabase-managed role was made.

**Validation:** Role privilege and schema checks passed. No end-to-end HTTP API test with real user credentials or new sign-up was performed. That limitation does not invalidate the narrow database-defaults remediation but must not be represented as application-wide acceptance testing.

**Out of scope, separately tracked by Supabase Security Advisor:** One mutable-function-search-path warning and informational RLS-without-policy entries. These are not evidence of failure of the 30 October change; review them in the normal security hardening workstream.

**Closure criterion:** Future public tables created by the application database owner no longer receive implicit API-role access, existing objects were unaffected, and guidance for explicit grants has been committed. Met.
