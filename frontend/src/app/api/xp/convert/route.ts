import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";

// Rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false; // Stricter: 10 converts/min
  entry.count++;
  return true;
}

/**
 * POST /api/xp/convert
 * Convert XP -> ZENI (record in DB, on-chain transfer via Treasury later)
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const apiKey = req.headers.get("x-api-key");
    if (!process.env.ZENI_API_KEY || apiKey !== process.env.ZENI_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { user_id, platform, xp_amount } = body;

    // Validate inputs
    if (!user_id || !platform || xp_amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof xp_amount !== "number" || xp_amount <= 0 || xp_amount > 10_000_000 || !Number.isInteger(xp_amount)) {
      return NextResponse.json({ error: "Invalid xp_amount" }, { status: 400 });
    }

    const rate = XP_RATES[platform];
    if (!rate) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const safeUserId = String(user_id).substring(0, 36);

    // Calculate ZENI amount
    const zeniAmount = Math.floor(xp_amount / rate);
    if (zeniAmount <= 0) {
      return NextResponse.json({ error: `Need at least ${rate} XP to convert` }, { status: 400 });
    }

    // Check user has enough XP
    const { data: balance } = await supabaseAdmin
      .from("zeni_xp_balances")
      .select("xp_balance, total_converted")
      .eq("user_id", safeUserId)
      .eq("platform", platform)
      .single();

    if (!balance || balance.xp_balance < xp_amount) {
      return NextResponse.json({ error: "Insufficient XP balance" }, { status: 400 });
    }

    // Get user wallet
    const { data: wallet } = await supabaseAdmin
      .from("zeni_wallets")
      .select("address")
      .eq("user_id", safeUserId)
      .eq("is_primary", true)
      .single();

    if (!wallet) {
      return NextResponse.json({ error: "No wallet connected" }, { status: 400 });
    }

    // Deduct XP atomically
    const xpUsed = zeniAmount * rate;
    await supabaseAdmin
      .from("zeni_xp_balances")
      .update({
        xp_balance: balance.xp_balance - xpUsed,
        total_converted: (balance.total_converted || 0) + xpUsed,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", safeUserId)
      .eq("platform", platform);

    // Record XP spend transaction
    await supabaseAdmin.from("zeni_xp_transactions").insert({
      user_id: safeUserId,
      platform,
      xp_amount: -xpUsed,
      action: "convert_to_zeni",
      description: `Converted ${xpUsed} XP to ${zeniAmount} ZENI`,
    });

    // Record ZENI transaction (pending on-chain)
    await supabaseAdmin.from("zeni_token_transactions").insert({
      user_id: safeUserId,
      from_address: "treasury",
      to_address: wallet.address,
      amount: zeniAmount,
      tx_type: "xp_conversion",
      status: "pending",
      description: `XP conversion: ${xpUsed} XP = ${zeniAmount} ZENI (${platform})`,
    });

    return NextResponse.json({
      success: true,
      xp_used: xpUsed,
      zeni_amount: zeniAmount,
      status: "pending",
    });
  } catch {
    console.error("[XP_CONVERT] Unexpected error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
