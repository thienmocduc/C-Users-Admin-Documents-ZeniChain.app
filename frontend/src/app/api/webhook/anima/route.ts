import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";

// Rate limiter for webhook
const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 60) return false; // 60 webhooks/min
  entry.count++;
  return true;
}

// Valid events
const VALID_EVENTS = ["order_completed", "referral_signup", "commission_earned", "kyc_verified"];

/**
 * POST /api/webhook/anima
 * Webhook from ANIMA Care -> Zeni Chain
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { event, data, api_key } = body;

    // Auth check — webhook secret must be configured
    if (!process.env.ZENI_WEBHOOK_SECRET || api_key !== process.env.ZENI_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }

    // Validate event type
    if (!event || !VALID_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    switch (event) {
      case "order_completed": {
        const { user_id, order_id, order_value_vnd } = data;
        if (!user_id || !order_id || typeof order_value_vnd !== "number" || order_value_vnd <= 0 || order_value_vnd > 1_000_000_000) {
          return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }
        const xpEarned = Math.floor(order_value_vnd / 1000);
        if (xpEarned <= 0) {
          return NextResponse.json({ error: "Order value too low" }, { status: 400 });
        }
        await earnXP(String(user_id).substring(0, 36), "anima_care", xpEarned, "order", String(order_id).substring(0, 100), `Order value: ${order_value_vnd} VND`);
        return NextResponse.json({ success: true, xp_earned: xpEarned });
      }

      case "referral_signup": {
        const { referrer_id, new_user_id, referral_code } = data;
        if (!referrer_id || !new_user_id) {
          return NextResponse.json({ error: "Invalid referral data" }, { status: 400 });
        }
        const xpBonus = 500;
        await earnXP(String(referrer_id).substring(0, 36), "anima_care", xpBonus, "referral", String(new_user_id).substring(0, 36), `Referral: ${String(referral_code || "").substring(0, 20)}`);
        return NextResponse.json({ success: true, xp_earned: xpBonus });
      }

      case "commission_earned": {
        const { user_id, commission_type, amount, currency, order_ref } = data;
        if (!user_id || !commission_type || typeof amount !== "number" || amount <= 0 || amount > 1_000_000) {
          return NextResponse.json({ error: "Invalid commission data" }, { status: 400 });
        }
        const validTypes = ["f1_direct", "group_income", "pro_fee", "ktv_fee", "ambassador_pool"];
        if (!validTypes.includes(commission_type)) {
          return NextResponse.json({ error: "Invalid commission type" }, { status: 400 });
        }

        await supabaseAdmin.from("zeni_commissions").insert({
          user_id: String(user_id).substring(0, 36),
          commission_type,
          amount,
          currency: currency === "VND" ? "VND" : "ZENI",
          status: "escrow",
          escrow_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          reference_order: order_ref ? String(order_ref).substring(0, 100) : null,
          platform: "anima_care",
        });
        return NextResponse.json({ success: true, status: "escrow" });
      }

      case "kyc_verified": {
        const { user_id, full_name } = data;
        if (!user_id) {
          return NextResponse.json({ error: "Invalid KYC data" }, { status: 400 });
        }
        await supabaseAdmin
          .from("zeni_users")
          .update({
            kyc_status: "verified",
            full_name: full_name ? String(full_name).substring(0, 100) : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq("id", String(user_id).substring(0, 36));
        return NextResponse.json({ success: true, kyc: "verified" });
      }

      default:
        return NextResponse.json({ error: "Unhandled event" }, { status: 400 });
    }
  } catch {
    console.error("[WEBHOOK] Unexpected error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function earnXP(userId: string, platform: string, xpAmount: number, action: string, refId: string, desc: string) {
  await supabaseAdmin.from("zeni_xp_transactions").insert({
    user_id: userId,
    platform,
    xp_amount: xpAmount,
    action,
    reference_id: refId,
    description: desc,
  });

  const { data: existing } = await supabaseAdmin
    .from("zeni_xp_balances")
    .select("xp_balance, total_earned")
    .eq("user_id", userId)
    .eq("platform", platform)
    .single();

  if (existing) {
    await supabaseAdmin
      .from("zeni_xp_balances")
      .update({
        xp_balance: existing.xp_balance + xpAmount,
        total_earned: existing.total_earned + xpAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("platform", platform);
  } else {
    await supabaseAdmin.from("zeni_xp_balances").insert({
      user_id: userId,
      platform,
      xp_balance: xpAmount,
      total_earned: xpAmount,
    });
  }
}
