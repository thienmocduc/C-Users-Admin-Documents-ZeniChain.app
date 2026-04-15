# ZENI CHAIN APP — SESSION HANDOFF
# Ngay: 15/04/2026
# Dung cho: Session moi tiep tuc Zeni Chain App

---

## TRANG THAI HIEN TAI

### 6 Smart Contracts DA DEPLOY — POLYGON MAINNET

| Contract | Address | Status | Verified |
|----------|---------|--------|----------|
| **$ZENI Token (ERC-20)** | `0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1` | ✅ ON-CHAIN | ✅ Sourcify |
| **AffiliateCommission** | `0x1d5963FcCfC548275293e51f0F6C7aC482E0b714` | ✅ ON-CHAIN | ✅ Sourcify |
| **ZeniBadge (SBT)** | `0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D` | ✅ ON-CHAIN | ✅ Sourcify |
| **ZeniTreasury** | `0x359E7Bc28023D8f8906D0Fa7c18Ce60E6b5f1448` | ✅ ON-CHAIN | ✅ Sourcify |
| **VestingContract** | `0xD51C4816B5B932fE2dea8DfD082878A9146Ad00a` | ✅ ON-CHAIN | ✅ Sourcify |
| **VoucherNFT (ERC-721)** | `0x64D880F84d1A1212F876eb8F150cdca91857e1DF` | ✅ ON-CHAIN | ✅ Sourcify |

- **Network:** Polygon Mainnet (Chain ID: 137)
- **Deployer:** `0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91`
- **Tong gas:** ~1.5 POL
- **Verification:** 6/6 perfect on Sourcify

### Token Info
- Name: Zeni
- Symbol: ZENI
- Total Supply: 1,000,000,000 (1 ty)
- Treasury: 950M ZENI locked
- Deployer: 0 ZENI (da chuyen het vao Treasury)

---

## FRONTEND STATUS

### Tech Stack
- Next.js 16 + Tailwind CSS 4 + TypeScript
- wagmi 3 + viem 2 (Polygon wallet integration)
- ethers 6 (on-chain data reading)
- TanStack Query (caching)
- Zustand (state management)
- Framer Motion (animations)
- next-themes (Light/Dark)
- i18n (12 ngon ngu ASEAN)

### Pages (22 routes, build 0 errors)
- Landing page (zenichain.app style)
- Dashboard, Wallet, Tokenomics, Staking, Governance
- Affiliate, Pools, NFTs, Voucher, Analytics
- Admin, On-chain (data that tu blockchain)
- Settings, Login, Register
- API routes: /api/xp/earn, /api/xp/convert, /api/webhook/anima

### On-chain Integration
- WagmiProvider configured (Polygon Mainnet)
- ConnectWallet component in Topbar
- useOnChain hooks: useZeniStats, useZeniBalance, useTreasuryInfo, useVestingInfo, useVoucherStats, useAllContractBalances
- Wallet page: hien thi balance that tu blockchain
- On-chain page: doc data that tu 6 contracts
- Tokenomics page: 6 contracts addresses updated

---

## FILES TRONG FOLDER NAY

```
C:\Users\Admin\Documents\Zeni-Chain_AppWeb3\
├── contracts/
│   ├── ZeniToken.sol           — $ZENI ERC-20 (1 ty, XP conversion)
│   ├── AffiliateCommission.sol — Escrow 7 ngay, commission types
│   ├── AnimaBadge.sol          — Soul-bound NFT badges
│   ├── VestingContract.sol     — Linear vesting + cliff + revoke
│   ├── ZeniTreasury.sol        — Multi-sig 2/3, 5 subsidiary pools
│   ├── VoucherNFT.sol          — Transferable voucher, expiry, burn
│   ├── *_flat.sol              — Flattened sources (for manual verify)
├── scripts/
│   ├── deploy.js               — Deploy testnet
│   ├── deploy-mainnet.js       — Deploy mainnet ✅ DA CHAY
│   ├── deploy-treasury.js      — Deploy treasury ✅ DA CHAY
│   ├── deploy-vesting-voucher.js — Deploy vesting + voucher ✅ DA CHAY
│   ├── verify-all.js           — Sourcify verification ✅ 6/6
│   └── verify-sourcify.js      — Check verify status
├── frontend/
│   ├── src/
│   │   ├── app/                — 22 Next.js pages
│   │   ├── components/         — UI + Layout components
│   │   ├── hooks/              — useOnChain, useTranslation
│   │   ├── lib/                — contracts.ts, wagmi.ts, supabase.ts, i18n
│   │   └── stores/             — Zustand stores
│   └── package.json
├── artifacts/                  — Compiled ABIs + bytecode
├── hardhat.config.js           — Hardhat 3 config
├── .env                        — Private key + RPC URLs
└── package.json
```

---

## CREDENTIALS (KHONG CHIA SE)

- **Deployer wallet:** `0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91`
- **Private key:** trong file `.env`
- **Multi-sig signers:**
  - [0] Chairman: `0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91`
  - [1] CEO: `0xf20Dbb66063df65c787868ef15dA4f1eBE36105a`
  - [2] CTO: `0x834E18FDaf150E9dd07dD962EAE77F7CFa342674`

---

## VIEC CAN LAM TRONG SESSION MOI

### 1. TRANSFER ZENI TO VESTING
- Deployer hien tai co 0 ZENI (da chuyen 950M vao Treasury)
- Can transfer tu Treasury → VestingContract (200M) cho team vesting
- Hoac tu VestingContract doc ZENI tu Treasury

### 2. ADD BENEFICIARIES VESTING
- Founder (Chairman): 100M, cliff 1yr, vest 5yr
- Tech Team: 50M, cliff 1yr, vest 3yr
- CEO: 10M, cliff 1yr, vest 3yr
- Clever Team: 40M, cliff 1yr, vest 3yr
- Can wallet addresses cua tung nguoi

### 3. DEPLOY FRONTEND
- Build thanh cong (0 errors)
- Can chon hosting: Vercel hoac Netlify
- Domain: zenichain.app (chua setup)

### 4. WALLET CONNECT PROJECT ID
- Hien dung "demo" — can dang ky WalletConnect Cloud
- https://cloud.walletconnect.com/

---

## CHINH SACH DA CHOT (Chairman approved)

### Phi giao dich
- Transfer/mua ban $ZENI: **0.05 ZENI co dinh**
- Rut hoa hong tu nen tang: **0.5% gia tri rut**

### XP → ZENI conversion
- Pool: 20% tong cung = 200,000,000 ZENI
- ANIMA Care: 1,000 XP = 1 ZENI
- WellKOC: 1,250 XP = 1 ZENI
- NexBuild: 833 XP = 1 ZENI
- Zeni Digital: 2,000 XP = 1 ZENI

### VoucherNFT (NEW — deployed 15/04/2026)
- ERC-721 transferable, expirable (30 ngay), burnable
- 7 types: discount 10-50%, free service, cash value
- XP cost: 500-10000 XP tuy loai
- Max supply: 1,000,000 vouchers
- Batch mint: max 50/tx
- Authorized minters system (backend services)

### Affiliate Commission
- F1 direct: 25-30%
- Group income: 20%
- Pro/KTV fee referral: 15%
- Ambassador pool: 6 cap x 2%
- Escrow: 7 ngay hold

### Soul-bound badges (SBT)
- Non-transferable, 1 user = 1 badge moi loai
- 8 categories: checkin, booking, order, review, scan, affiliate, xp, rank

---

## TONG KET SESSION 15/04/2026

1. ✅ Code VoucherNFT.sol (ERC-721, transferable, expirable, burnable)
2. ✅ Compile all contracts (Hardhat 3, solc 0.8.28)
3. ✅ Deploy VestingContract → 0xD51C4816B5B932fE2dea8DfD082878A9146Ad00a
4. ✅ Deploy VoucherNFT → 0x64D880F84d1A1212F876eb8F150cdca91857e1DF
5. ✅ Verify 6/6 contracts on Sourcify (perfect status)
6. ✅ Frontend: wagmi WalletProvider + ConnectWallet component
7. ✅ Frontend: useOnChain hooks (7 hooks doc blockchain that)
8. ✅ Frontend: Update Wallet + Tokenomics + OnChain pages
9. ✅ Frontend: contracts.ts updated (6 contracts + ABIs)
10. ✅ Build frontend: 22 routes, 0 errors
