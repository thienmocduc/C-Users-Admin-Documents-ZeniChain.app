import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, XP_RATES } from "@/lib/supabase";
import { ethers } from "ethers";
import { ZENI_TOKEN, POLYGON_RPC } from "@/lib/contracts";

/**
 * POST /api/xp/convert
 * Convert XP → ZENI on-chain
 *
 * Body: { user_id, platform, xp_amount }
 * Returns: { zeni_amount, tx_hash }
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ZENI_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user_id, platform, xp_amount } = await req.json();

    if (!user_id || !platform || !xp_amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rate = XP_RATES[platform];
    if (!rate) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    // Calculate ZENI amount
    const zeniAmount = Math.floor(xp_amount / rate);
    if (zeniAmount <= 0) {
      return NextResponse.json({ error: `Need at least ${rate} XP to convert` }, { status: 400 });
    }

    // Check user has enough XP
    const { data: balance } = await supabaseAdmin
      .from("zeni_xp_balances")
      .select("xp_balance")
      .eq("user_id", user_id)
      .eq("platform", platform)
      .single();

    if (!balance || balance.xp_balance < xp_amount) {
      return NextResponse.json({ error: "Insufficient XP balance" }, { status: 400 });
    }

    // Get user wallet address
    const { data: wallet } = await supabaseAdmin
      .from("zeni_wallets")
      .select("address")
      .eq("user_id", user_id)
      .eq("is_primary", true)
      .single();

    if (!wallet) {
      return NextResponse.json({ error: "No wallet connected" }, { status: 400 });
    }

    // Execute on-chain transfer from Treasury
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || "", provider);
    const zeniToken = new ethers.Contract(
      ZENI_TOKEN,
      ["function transfer(address,uint256) returns (bool)"],
      signer
    );

    const weiAmount = ethers.parseEther(zeniAmount.toString());

    // Note: In production, this should call ZeniTreasury.spendFromSubsidiary()
    // For now, direct transfer from deployer (which has 0 ZENI — need treasury integration)
    // TODO: Integrate with ZeniTreasury contract for proper pool management

    // Deduct XP
    const xpUsed = zeniAmount * rate;
    await supabaseAdmin
      .from("zeni_xp_balances")
      .update({
        xp_balance: balance.xp_balance - xpUsed,
        total_converted: (balance.xp_balance || 0) + xpUsed,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .eq("platform", platform);

    // Record XP transaction (negative)
    await supabaseAdmin.from("zeni_xp_transactions").insert({
      user_id,
      platform,
      xp_amount: -xpUsed,
      action: "convert_to_zeni",
      description: `Converted ${xpUsed} XP → ${zeniAmount} ZENI`,
    });

    // Record ZENI transaction
    await supabaseAdmin.from("zeni_token_transactions").insert({
      user_id,
      from_address: "treasury",
      to_address: wallet.address,
      amount: zeniAmount,
      tx_type: "xp_conversion",
      status: "pending",
      description: `XP→ZENI: ${xpUsed} XP = ${zeniAmount} ZENI (${platform})`,
    });

    return NextResponse.json({
      success: true,
      xp_used: xpUsed,
      zeni_amount: zeniAmount,
      zeni_usd: (zeniAmount * 0.05).toFixed(2),
      rate: `${rate} XP = 1 ZENI`,
      wallet: wallet.address,
      status: "pending",
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
