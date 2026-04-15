import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client-side (anon key, RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service role, bypasses RLS — only use in API routes)
export const supabaseAdmin = (() => {
  if (!supabaseServiceKey) {
    console.error("[SECURITY] SUPABASE_SERVICE_ROLE_KEY not set! Admin operations will fail.");
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createClient(supabaseUrl, supabaseServiceKey);
})();

// XP conversion rates — server-side only (do NOT import in client components)
export const XP_RATES: Record<string, number> = {
  anima_care: 1000,
  wellkoc: 1250,
  nexbuild: 833,
  zeni_digital: 2000,
  biotea84: 1000,
};
