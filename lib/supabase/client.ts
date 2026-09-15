import { createBrowserClient } from "@supabase/ssr";

// Note: intentionally untyped against the generated Database shape. The app
// defines its own domain types in `types/index.ts` and casts query results
// at the call site, which keeps the Supabase generics from fighting with
// partial Insert/Update shapes used throughout the codebase.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
