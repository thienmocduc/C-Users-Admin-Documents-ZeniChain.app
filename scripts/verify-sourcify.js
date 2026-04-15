/**
 * Verify contracts on Sourcify (free, no API key needed)
 * Sourcify verification automatically syncs to Polygonscan
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONTRACTS = [
  {
    name: "ZeniToken",
    address: "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1",
    file: "ZeniToken.sol",
  },
  {
    name: "AffiliateCommission",
    address: "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714",
    file: "AffiliateCommission.sol",
  },
  {
    name: "ZeniBadge",
    address: "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D",
    file: "AnimaBadge.sol",
  },
  {
    name: "ZeniTreasury",
    address: "0x359E7Bc28023D8f8906D0Fa7c18Ce60E6b5f1448",
    file: "ZeniTreasury.sol",
  },
  {
    name: "VestingContract",
    address: "0xD51C4816B5B932fE2dea8DfD082878A9146Ad00a",
    file: "VestingContract.sol",
  },
  {
    name: "VoucherNFT",
    address: "0x64D880F84d1A1212F876eb8F150cdca91857e1DF",
    file: "VoucherNFT.sol",
  },
];

const CHAIN_ID = "137"; // Polygon Mainnet

async function checkVerified(address) {
  try {
    const url = `https://sourcify.dev/server/check-all-by-addresses?addresses=${address}&chainIds=${CHAIN_ID}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.[0]?.status === "perfect" || data?.[0]?.status === "partial";
  } catch {
    return false;
  }
}

async function verifyOnPolygonscan(address) {
  try {
    const url = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.status === "1";
  } catch {
    return false;
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║  CONTRACT VERIFICATION STATUS                     ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  for (const c of CONTRACTS) {
    const polygonscan = await verifyOnPolygonscan(c.address);
    const sourcify = await checkVerified(c.address);

    const status = polygonscan ? "✅ Verified (Polygonscan)" :
                   sourcify ? "✅ Verified (Sourcify)" : "❌ Not verified";

    console.log(`${c.name}`);
    console.log(`  Address: ${c.address}`);
    console.log(`  Polygonscan: ${polygonscan ? "✅" : "❌"}`);
    console.log(`  Sourcify: ${sourcify ? "✅" : "❌"}`);
    console.log(`  Status: ${status}\n`);
  }

  console.log("───────────────────────────────────────────");
  console.log("To verify manually on Polygonscan:");
  console.log("1. Go to https://polygonscan.com/address/<ADDRESS>#code");
  console.log("2. Click 'Verify & Publish'");
  console.log("3. Compiler: 0.8.28, Optimizer: Yes (200 runs)");
  console.log("4. Paste flattened source from contracts/*_flat.sol");
  console.log("───────────────────────────────────────────");
}

main().catch(console.error);
