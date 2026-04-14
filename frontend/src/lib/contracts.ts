export const ZENI_TOKEN = "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1" as const;
export const AFFILIATE_CONTRACT = "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714" as const;
export const BADGE_CONTRACT = "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D" as const;
export const TREASURY_CONTRACT = "0x359E7Bc28023D8f8906D0Fa7c18Ce60E6b5f1448" as const;
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
