import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";

/**
 * POST /api/xp/earn
 * Called by ANIMA Care backend when user earns XP
 *
 * Body: { user_id, platform, xp_amount, action, reference_id, description }
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ZENI_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user_id, platform, xp_amount, action, reference_id, description } = await req.json();

    if (!user_id || !platform || !xp_amount || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!XP_RATES[platform]) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    // 1. Record XP transaction
    const { error: txError } = await supabaseAdmin.from("zeni_xp_transactions").insert({
      user_id,
      platform,
      xp_amount,
      action,
      reference_id,
      description,
    });

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    // 2. Update XP balance (upsert)
    const { data: existing } = await supabaseAdmin
      .from("zeni_xp_balances")
      .select("xp_balance, total_earned")
      .eq("user_id", user_id)
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
        .eq("user_id", user_id)
        .eq("platform", platform);
    } else {
      await supabaseAdmin.from("zeni_xp_balances").insert({
        user_id,
        platform,
        xp_balance: xp_amount,
        total_earned: xp_amount,
      });
    }

    return NextResponse.json({
      success: true,
      xp_earned: xp_amount,
      platform,
      conversion_rate: `${XP_RATES[platform]} XP = 1 ZENI`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
