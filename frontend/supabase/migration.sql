-- ═══════════════════════════════════════════════
-- ZENI CHAIN — SUPABASE SCHEMA
-- Project riêng, không chung ANIMA Care
-- ═══════════════════════════════════════════════

-- 1. Users (Zeni ID)
CREATE TABLE IF NOT EXISTS zeni_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT,
  full_name TEXT,
  zeni_id TEXT UNIQUE, -- ZNI-XXX-XXXXX
  wallet_address TEXT, -- Polygon wallet (Privy MPC)
  kyc_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  rank TEXT DEFAULT 'starter', -- starter, buyer_free, koc_pro, ambassador
  avatar_url TEXT,
  platform_origin TEXT DEFAULT 'zenichain', -- which platform they signed up from
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. XP Balances (per user per platform)
CREATE TABLE IF NOT EXISTS zeni_xp_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  platform TEXT NOT NULL DEFAULT 'anima_care', -- anima_care, wellkoc, nexbuild, zeni_digital, biotea84
  xp_balance BIGINT NOT NULL DEFAULT 0,
  total_earned BIGINT NOT NULL DEFAULT 0,
  total_converted BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- 3. XP Transactions (earn/spend/convert log)
CREATE TABLE IF NOT EXISTS zeni_xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  platform TEXT NOT NULL,
  xp_amount BIGINT NOT NULL, -- positive = earn, negative = spend/convert
  action TEXT NOT NULL, -- order, referral, review, convert_to_zeni, mint_voucher, bonus
  reference_id TEXT, -- order_id, affiliate_id, etc.
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ZENI Token Transactions (on-chain mirrors)
CREATE TABLE IF NOT EXISTS zeni_token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES zeni_users(id),
  tx_hash TEXT UNIQUE, -- Polygon tx hash
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL(30, 18) NOT NULL, -- ZENI amount
  tx_type TEXT NOT NULL, -- xp_conversion, affiliate_commission, staking_reward, transfer, mint_voucher, pool_distribution
  status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  block_number BIGINT,
  gas_used DECIMAL(20, 0),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Wallets (connected wallets per user)
CREATE TABLE IF NOT EXISTS zeni_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  address TEXT NOT NULL UNIQUE,
  wallet_type TEXT DEFAULT 'privy_mpc', -- privy_mpc, metamask, walletconnect
  is_primary BOOLEAN DEFAULT true,
  zeni_balance DECIMAL(30, 18) DEFAULT 0, -- cached balance
  pol_balance DECIMAL(30, 18) DEFAULT 0, -- cached POL balance
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Affiliate Links
CREATE TABLE IF NOT EXISTS zeni_affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  code TEXT UNIQUE NOT NULL, -- ANIMA-DUC-4821
  platform TEXT NOT NULL DEFAULT 'anima_care',
  referral_count INT DEFAULT 0,
  total_commission DECIMAL(30, 18) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Commissions (mirrors on-chain escrow)
CREATE TABLE IF NOT EXISTS zeni_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  commission_type TEXT NOT NULL, -- f1_direct, group_income, pro_fee, ktv_fee, ambassador_pool
  amount DECIMAL(30, 18) NOT NULL,
  currency TEXT DEFAULT 'ZENI', -- ZENI or VND
  status TEXT DEFAULT 'escrow', -- escrow, released, clawback
  escrow_until TIMESTAMPTZ,
  tx_hash TEXT, -- on-chain tx
  reference_order TEXT,
  platform TEXT DEFAULT 'anima_care',
  created_at TIMESTAMPTZ DEFAULT now(),
  released_at TIMESTAMPTZ
);

-- 8. NFT Badges (mirrors on-chain SBT)
CREATE TABLE IF NOT EXISTS zeni_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  badge_type TEXT NOT NULL, -- checkin, booking, order, review, scan, affiliate, xp, rank
  token_id BIGINT, -- on-chain NFT token ID
  tx_hash TEXT,
  platform TEXT DEFAULT 'anima_care',
  metadata JSONB,
  minted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- 9. Staking Positions
CREATE TABLE IF NOT EXISTS zeni_staking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zeni_users(id),
  amount DECIMAL(30, 18) NOT NULL,
  pool TEXT NOT NULL, -- flexible, 90day, 180day, 365day
  apy DECIMAL(5, 2) NOT NULL, -- 12, 18, 24, 28
  start_date TIMESTAMPTZ DEFAULT now(),
  unlock_date TIMESTAMPTZ,
  rewards_earned DECIMAL(30, 18) DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed, unstaked
  tx_hash TEXT
);

-- ═══ INDEXES ═══
CREATE INDEX IF NOT EXISTS idx_xp_user_platform ON zeni_xp_balances(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_xp_tx_user ON zeni_xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_tx_platform ON zeni_xp_transactions(platform);
CREATE INDEX IF NOT EXISTS idx_token_tx_user ON zeni_token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_tx_hash ON zeni_token_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_wallet_user ON zeni_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_address ON zeni_wallets(address);
CREATE INDEX IF NOT EXISTS idx_commission_user ON zeni_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_user ON zeni_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_user ON zeni_staking(user_id);

-- ═══ RLS (Row Level Security) ═══
ALTER TABLE zeni_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_xp_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeni_staking ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users read own data" ON zeni_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users read own xp" ON zeni_xp_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own xp_tx" ON zeni_xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own token_tx" ON zeni_token_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own wallets" ON zeni_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own affiliates" ON zeni_affiliate_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own commissions" ON zeni_commissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own badges" ON zeni_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own staking" ON zeni_staking FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (backend API)
-- (service_role bypasses RLS by default)
