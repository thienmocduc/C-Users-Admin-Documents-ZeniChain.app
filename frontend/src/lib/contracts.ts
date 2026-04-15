export const ZENI_TOKEN = "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1" as const;
export const AFFILIATE_CONTRACT = "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714" as const;
export const BADGE_CONTRACT = "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D" as const;
export const TREASURY_CONTRACT = "0x359E7Bc28023D8f8906D0Fa7c18Ce60E6b5f1448" as const;
export const VESTING_CONTRACT = "0xD51C4816B5B932fE2dea8DfD082878A9146Ad00a" as const;
export const VOUCHER_CONTRACT = "0x64D880F84d1A1212F876eb8F150cdca91857e1DF" as const;
export const DEPLOYER_ADDRESS = "0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91" as const;

export const ZENI_PRICE_USD = 0.05;

export const POLYGON_CHAIN_ID = 137;
export const POLYGON_RPC = "https://polygon-bor-rpc.publicnode.com";

export const ZENI_CHAIN_CONFIG = {
  id: POLYGON_CHAIN_ID,
  name: "Polygon Mainnet",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [POLYGON_RPC] },
    public: { http: [POLYGON_RPC] },
  },
  blockExplorers: {
    default: { name: "Polygonscan", url: "https://polygonscan.com" },
  },
} as const;

export const CONTRACTS = {
  zeniToken: {
    address: ZENI_TOKEN,
    name: "$ZENI Token",
    symbol: "ZENI",
    decimals: 18,
  },
  affiliateCommission: {
    address: AFFILIATE_CONTRACT,
    name: "AffiliateCommission",
  },
  zeniBadge: {
    address: BADGE_CONTRACT,
    name: "ZeniBadge (SBT)",
  },
  zeniTreasury: {
    address: TREASURY_CONTRACT,
    name: "ZeniTreasury",
  },
  vestingContract: {
    address: VESTING_CONTRACT,
    name: "VestingContract",
  },
  voucherNFT: {
    address: VOUCHER_CONTRACT,
    name: "VoucherNFT (ERC-721)",
  },
} as const;

// ERC20 ABI (minimal for reading)
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
] as const;

// Treasury ABI (minimal for reading)
export const TREASURY_ABI = [
  "function getSubsidiaryInfo(string) view returns (bool,bool,uint256,uint256,uint256,uint256,uint256,uint256)",
  "function getGeneralPools() view returns (uint256,uint256,uint256,uint256,uint256)",
  "function getTotalLocked() view returns (uint256)",
  "function activatedCount() view returns (uint8)",
  "function signers(uint256) view returns (address)",
] as const;

// Vesting ABI (minimal for reading)
export const VESTING_ABI = [
  "function getVestedAmount(address) view returns (uint256)",
  "function getClaimableAmount(address) view returns (uint256)",
  "function getSchedule(address) view returns (uint256,uint256,uint256,uint256,uint256,string,bool,uint256)",
  "function getBeneficiaryCount() view returns (uint256)",
  "function getBeneficiaryAt(uint256) view returns (address)",
  "function totalAllocated() view returns (uint256)",
  "function isBeneficiary(address) view returns (bool)",
] as const;

// Badge (SBT) ABI
export const BADGE_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function userBadges(address, uint256) view returns (uint256)",
  "function badges(uint256) view returns (uint256 badgeType, uint256 mintedAt, string subsidiary, string metadata)",
  "function hasBadge(address, uint256) view returns (bool)",
  "function totalBadgesMinted() view returns (uint256)",
  "function subsidiaryBadgeCount(string) view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
] as const;

// Affiliate Commission ABI
export const AFFILIATE_ABI = [
  "function userCommissions(address, uint256) view returns (uint256)",
  "function commissions(uint256) view returns (address recipient, uint256 amount, uint256 createdAt, uint256 releaseAt, bool released, bool clawedBack, string commissionType, string subsidiary)",
  "function commissionCount() view returns (uint256)",
  "function totalEscrow() view returns (uint256)",
  "function totalReleased() view returns (uint256)",
  "function totalClawedBack() view returns (uint256)",
  "function escrowDays() view returns (uint256)",
  "function subsidiaryTotalPaid(string) view returns (uint256)",
] as const;

// VoucherNFT ABI (minimal for reading + redeem)
export const VOUCHER_ABI = [
  "function getUserVouchers(address) view returns (uint256[])",
  "function getVoucherInfo(uint256) view returns (uint256,uint256,uint256,uint256,string,string,bool,bool,address)",
  "function getUserActiveVoucherCount(address) view returns (uint256)",
  "function isVoucherValid(uint256) view returns (bool)",
  "function getXpCost(uint256) view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function totalRedeemed() view returns (uint256)",
  "function totalExpired() view returns (uint256)",
  "function expiryDuration() view returns (uint256)",
] as const;
