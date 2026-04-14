import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";

/**
 * POST /api/webhook/anima
 * Webhook from ANIMA Care → Zeni Chain
 * Called when events happen in ANIMA Care app:
 * - order_completed → earn XP
 * - referral_signup → earn XP + record affiliate
 * - commission_earned → record commission in escrow
 * - kyc_verified → update Zeni ID
 *
 * Body: { event, data, api_key }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data, api_key } = body;

    if (api_key !== process.env.ZENI_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }

    switch (event) {
      case "order_completed": {
        // User completed an order → earn XP based on order value
        const { user_id, order_id, order_value_vnd } = data;
        const xpEarned = Math.floor(order_value_vnd / 1000); // 1 VND = 0.001 XP → 1,000 VND = 1 XP

        await earnXP(user_id, "anima_care", xpEarned, "order", order_id, `Order #${order_id} - ${order_value_vnd.toLocaleString()} VND`);

        return NextResponse.json({ success: true, xp_earned: xpEarned });
      }

      case "referral_signup": {
        // Someone signed up via referral → referrer earns XP
        const { referrer_id, new_user_id, referral_code } = data;
        const xpBonus = 500; // 500 XP for referral

        await earnXP(referrer_id, "anima_care", xpBonus, "referral", new_user_id, `Referral: ${referral_code}`);

        return NextResponse.json({ success: true, xp_earned: xpBonus });
      }

      case "commission_earned": {
        // Affiliate commission → record in Zeni DB (mirrors on-chain)
        const { user_id, commission_type, amount, currency, order_ref } = data;

        await supabaseAdmin.from("zeni_commissions").insert({
          user_id,
          commission_type,
          amount,
          currency: currency || "ZENI",
          status: "escrow",
          escrow_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          reference_order: order_ref,
          platform: "anima_care",
        });

        return NextResponse.json({ success: true, status: "escrow" });
      }

      case "kyc_verified": {
        // KYC completed in ANIMA Care → update Zeni ID
        const { user_id, full_name } = data;

        await supabaseAdmin
          .from("zeni_users")
          .update({ kyc_status: "verified", full_name, updated_at: new Date().toISOString() })
          .eq("id", user_id);

        return NextResponse.json({ success: true, kyc: "verified" });
      }

      default:
        return NextResponse.json({ error: `Unknown event: ${event}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function earnXP(userId: string, platform: string, xpAmount: number, action: string, refId: string, desc: string) {
  // Record transaction
  await supabaseAdmin.from("zeni_xp_transactions").insert({
    user_id: userId,
    platform,
    xp_amount: xpAmount,
    action,
    reference_id: refId,
    description: desc,
  });

  // Update balance
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
