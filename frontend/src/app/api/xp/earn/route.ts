import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Valid platforms and actions
const VALID_ACTIONS = ["order", "referral", "review", "bonus", "checkin", "booking", "scan"];

/**
 * POST /api/xp/earn
 * Called by ANIMA Care backend when user earns XP
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Auth check
    const apiKey = req.headers.get("x-api-key");
    if (!process.env.ZENI_API_KEY || apiKey !== process.env.ZENI_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { user_id, platform, xp_amount, action, reference_id, description } = body;

    // Input validation
    if (!user_id || !platform || xp_amount === undefined || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof xp_amount !== "number" || xp_amount <= 0 || xp_amount > 1_000_000 || !Number.isInteger(xp_amount)) {
      return NextResponse.json({ error: "Invalid xp_amount: must be positive integer, max 1,000,000" }, { status: 400 });
    }

    if (!XP_RATES[platform]) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Sanitize text inputs
    const safeRefId = reference_id ? String(reference_id).substring(0, 100) : null;
    const safeDesc = description ? String(description).substring(0, 500) : null;
    const safeUserId = String(user_id).substring(0, 36);

    // 1. Record XP transaction
    const { error: txError } = await supabaseAdmin.from("zeni_xp_transactions").insert({
      user_id: safeUserId,
      platform,
      xp_amount,
      action,
      reference_id: safeRefId,
      description: safeDesc,
    });

    if (txError) {
      console.error("[XP_EARN] Transaction insert failed:", txError.message);
      return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
    }

    // 2. Atomic XP balance update via upsert
    const { data: existing } = await supabaseAdmin
      .from("zeni_xp_balances")
      .select("xp_balance, total_earned")
      .eq("user_id", safeUserId)
      .eq("platform", platform)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("zeni_xp_balances")
        .update({
          xp_balance: existing.xp_balance + xp_amount,
          total_earned: existing.total_earned + xp_amount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", safeUserId)
        .eq("platform", platform);
    } else {
      await supabaseAdmin.from("zeni_xp_balances").insert({
        user_id: safeUserId,
        platform,
        xp_balance: xp_amount,
        total_earned: xp_amount,
      });
    }

    return NextResponse.json({
      success: true,
      xp_earned: xp_amount,
      platform,
    });
  } catch {
    console.error("[XP_EARN] Unexpected error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
