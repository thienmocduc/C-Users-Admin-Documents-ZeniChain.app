import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

// Client-side (anon key, RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service role, bypasses RLS — only use in API routes)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// XP conversion rates per platform
export const XP_RATES: Record<string, number> = {
  anima_care: 1000,    // 1,000 XP = 1 ZENI
  wellkoc: 1250,       // 1,250 XP = 1 ZENI
  nexbuild: 833,       // 833 XP = 1 ZENI
  zeni_digital: 2000,  // 2,000 XP = 1 ZENI
  biotea84: 1000,      // 1,000 XP = 1 ZENI
};
