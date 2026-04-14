export const ZENI_TOKEN = "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1" as const;
export const AFFILIATE_CONTRACT = "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714" as const;
export const BADGE_CONTRACT = "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D" as const;
export const DEPLOYER_ADDRESS = "0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91" as const;

export const POLYGON_CHAIN_ID = 137;

export const ZENI_CHAIN_CONFIG = {
  id: POLYGON_CHAIN_ID,
  name: "Polygon Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
    public: { http: ["https://polygon-rpc.com"] },
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
} as const;
