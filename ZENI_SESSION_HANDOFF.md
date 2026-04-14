# ZENI CHAIN APP — SESSION HANDOFF
# Ngay: 12/04/2026
# Dung cho: Session moi tiep tuc Zeni Chain App

---

## TRANG THAI HIEN TAI

### 3 Smart Contracts DA DEPLOY — POLYGON MAINNET

| Contract | Address | Status |
|----------|---------|--------|
| **$ZENI Token (ERC-20)** | `0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1` | ✅ ON-CHAIN |
| **AffiliateCommission** | `0x1d5963FcCfC548275293e51f0F6C7aC482E0b714` | ✅ ON-CHAIN |
| **ZeniBadge (SBT)** | `0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D` | ✅ ON-CHAIN |

- **Network:** Polygon Mainnet (Chain ID: 137)
- **Deployer:** `0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91`
- **Gas used:** 0.9 POL (~$0.08)
- **Polygonscan:** https://polygonscan.com/address/0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1

### Token Info
- Name: Zeni
- Symbol: ZENI
- Total Supply: 1,000,000,000 (1 ty)
- Hien tai: 100% nam trong deployer wallet (chua phan bo)

---

## VIEC CAN LAM TRONG SESSION MOI

### 1. PHAN BO TOKENOMICS (CHAIRMAN APPROVED 12/04/2026)

**Gia token cong bo: $0.05/ZENI**
**Fully Diluted Valuation: $50,000,000**

| Pool | % | So luong | Vi | Vesting |
|------|---|---------|-----|---------|
| XP → ZENI conversion | 20% | 200,000,000 | Vi rieng | Dynamic rate, phat dan |
| Marketing/Events | 5% | 50,000,000 | Vi rieng | Admin quan ly |
| Quy du phong (Reserve) | 5% | 50,000,000 | Vi rieng | Admin quan ly |
| Treasury / DAO | 20% | 200,000,000 | Vi rieng | Admin/Governance |
| Huy dong von (Investors) | 15% | 150,000,000 | Deployer wallet | Cliff 6th + Vest 2yr |
| **Founder (Chairman)** | **10%** | **100,000,000** | Vi rieng | Cliff 1yr + Vest 5yr |
| **Team Cong Nghe** | **5%** | **50,000,000** | Vi rieng | Cliff 1yr + Vest 3yr |
| **Team Clever Van Hanh** | **5%** | **50,000,000** | Vi rieng | Cliff 1yr + Vest 3yr |
|   └── CEO (anh) | (1%) | (10,000,000) | Vi rieng | Cliff 1yr + Vest 3yr |
|   └── Team Clever con lai | (4%) | (40,000,000) | Vi rieng | Cliff 1yr + Vest 3yr |
| Ecosystem Fund | 10% | 100,000,000 | Vi rieng | Admin quan ly |
| Public / IPO SGX | 5% | 50,000,000 | CHUA MINT | mintIpoAllocation() khi IPO 2031 |

**Chairman so huu truc tiep: 31% = 310,000,000 ZENI**
- Founder: 10% (100M)
- Team CN: 5% (50M)  
- CEO trong Clever: 1% (10M)
- Huy dong von (neu ko ban): 15% (150M)

**Voting power: 82% (Founder Class x10)**
- Khong can ban token huy dong von → dung equity IPO SGX thay the
- Pool huy dong von 15% = du phong, chua lock, Chairman quyet dinh

**Gia theo giai doan:**
- Seed round: $0.01/ZENI
- Private sale: $0.03/ZENI  
- Public price: $0.05/ZENI (gia chinh thuc)
- Target 2028: $0.10+
- Target IPO 2031: $0.50+

### 2. VESTING CONTRACT
Code + deploy VestingContract.sol:
- Founder (Chairman): cliff 1 nam, vest 5 nam tuyen tinh
- Team Cong Nghe: cliff 1 nam, vest 3 nam tuyen tinh
- CEO (van hanh): cliff 1 nam, vest 3 nam tuyen tinh
- Team Clever: cliff 1 nam, vest 3 nam tuyen tinh
- Investors (khi co): cliff 6 thang, vest 2 nam tuyen tinh
- Moi doi tuong 1 VI RIENG trong Vesting Contract
- Chairman: Founder Class voting 1:10

### 3. FEE STRUCTURE
Update AffiliateCommission contract:
- Transfer/mua ban: 0.05 ZENI co dinh
- Rut hoa hong tu nen tang: 0.5% gia tri

### 4. VERIFY CONTRACTS TREN POLYGONSCAN
```
npx hardhat verify --network polygon 0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1 "deployer" "deployer" "deployer"
npx hardhat verify --network polygon 0x1d5963FcCfC548275293e51f0F6C7aC482E0b714 "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1"
npx hardhat verify --network polygon 0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D
```

### 5. FRONTEND INTEGRATION
- Privy embedded wallet trong ANIMA Care app
- Hien thi $ZENI balance
- NFT Badge gallery
- XP → ZENI conversion UI

---

## FILES TRONG FOLDER NAY

```
C:\Users\Admin\Documents\Zeni-Chain_AppWeb3\
├── contracts/
│   ├── ZeniToken.sol        — $ZENI ERC-20 (1 ty, community pool, XP conversion)
│   ├── AffiliateCommission.sol — Escrow 7 ngay, commission types, clawback
│   └── AnimaBadge.sol       — Soul-bound NFT badges, non-transferable
├── scripts/
│   ├── deploy.js            — Deploy testnet (Hardhat)
│   ├── deploy-optimized.js  — Deploy testnet (low gas)
│   ├── deploy-mainnet.js    — Deploy mainnet ✅ DA CHAY
│   └── deploy-badge-only.js — Deploy badge only
├── artifacts/               — Compiled contract ABIs + bytecode
├── hardhat.config.js        — Hardhat 3 config
├── .env                     — Private key + RPC URLs
├── .gitignore               — Bao ve .env + node_modules
└── package.json
```

---

## CREDENTIALS (KHONG CHIA SE)

- **Deployer wallet:** `0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91`
- **Private key:** trong file `.env` (KHONG commit len git)
- **Wallet co ETH mainnet:** anh co 0.00454 ETH + 63 POL + 6.13 USDT

---

## CHINH SACH DA CHOT (Chairman approved)

### Phi giao dich
- Transfer/mua ban $ZENI: **0.05 ZENI co dinh**
- Rut hoa hong tu nen tang: **0.5% gia tri rut**

### XP → ZENI conversion (CHAIRMAN APPROVED)
- Pool cho XP conversion: **20% tong cung = 200,000,000 ZENI** (KHONG PHAI 30%)
- Phan bo lai: Community 20% (XP) + Marketing 5% + Reserve 5%
- Rate RIENG tung subsidiary:
  - ANIMA Care: 1,000 XP = 1 ZENI (core, uu tien)
  - WellKOC: 1,250 XP = 1 ZENI (margin thap hon)
  - NexBuild: 833 XP = 1 ZENI (B2B deal lon)
  - Zeni Digital: 2,000 XP = 1 ZENI (SaaS, de earn)
- Admin co the dieu chinh rate tung platform
- Dynamic rate tang theo thoi gian (cang nhieu user → rate tang → khan hiem)
- Can upgrade ZeniToken.sol: mapping xpRates thay vi 1 rate chung
- Tat ca sub chi co XP on-chain, KHONG co token rieng
- $ZENI la token DUY NHAT cua toan he sinh thai

### Affiliate Commission (da trong smart contract)
- F1 direct: 25% (Buyer) / 30% (KOC Pro)
- Group income: 20% thu nhap doi tac truc tiep (chi Pro members)
- Pro fee referral: 15% (1 lan)
- KTV fee referral: 15% (1 lan)
- Ambassador pool: 6 cap x 2% = 12%
- Escrow: 7 ngay hold truoc khi release
- Clawback: admin thu hoi truoc release

### Soul-bound badges (SBT)
- Non-transferable (khong ban/cho duoc)
- 1 user = 1 badge moi loai
- Badge kem XP bonus (VD: earn badge → +500 XP)
- Categories: checkin, booking, order, review, scan, affiliate, xp, rank

### Voucher NFT (CHAIRMAN APPROVED)
- Voucher = NFT co the chuyen nhuong (ban/tang)
- CHI KHAT TRU vao don hang — KHONG doi truc tiep san pham
- User van phai mua hang, voucher chi giam gia
- User co the ban voucher cho nguoi khac tren marketplace
- Nguoi mua voucher → dung khat tru don hang cua ho
- Voucher co het han (30 ngay) + gioi han so luong
- Sau khi dung → burn on-chain
- Can code: VoucherNFT.sol (ERC-721, transferable, expirable, burnable)

### Mo hinh toan bo (CHOT)
```
Hanh dong → XP + Badge (SBT, kem XP bonus)
               ↓
XP co 3 duong:
  ├── XP → $ZENI (hold, trade, governance)
  ├── XP → Voucher NFT (khat tru don hang, ban lai duoc)
  └── XP → Redeem (khong con — BO, chi con 2 duong tren)
  
Voucher co 2 duong:
  ├── Tu dung: ap vao don hang → giam gia → voucher burn
  └── Ban lai: list marketplace → nguoi khac mua → ho dung khat tru
```

---

## LIEN QUAN ANIMA CARE APP

- **Repo:** `C:\Users\Admin\Documents\Anima Care Flatform wellness\ANIMA\`
- **Deploy:** Vercel → `app.animacare.global`
- **Supabase:** `pvhfzqopcorzaoghbywo`
- **Env vars can them khi integrate:**
  ```
  NEXT_PUBLIC_ZENI_TOKEN=0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1
  NEXT_PUBLIC_AFFILIATE_CONTRACT=0x1d5963FcCfC548275293e51f0F6C7aC482E0b714
  NEXT_PUBLIC_BADGE_CONTRACT=0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D
  NEXT_PUBLIC_POLYGON_CHAIN_ID=137
  ```

---

## TONG KET SESSION HOM NAY (ANIMA CARE)

Da hoan thanh trong session nay:
1. ✅ Booking flow end-to-end
2. ✅ Chatbot AI (Gemini)
3. ✅ Tam soat camera AI
4. ✅ Admin redesign 5 zones + Agent giam sat
5. ✅ Gamification (check-in, badges, leaderboard)
6. ✅ Affiliate System v2 (7 tables, 8 APIs)
7. ✅ Center CRM Agent (AI + auto care)
8. ✅ Security fix 18 routes (IDOR, brute force, injection)
9. ✅ Pentest passed
10. ✅ 3 Smart Contracts deployed POLYGON MAINNET
