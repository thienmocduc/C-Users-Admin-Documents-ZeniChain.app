import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Get network config
  const network = hre.network;
  const provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology"
  );
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

  console.log("╔════════════════════════════════════════╗");
  console.log("║   ZENI HOLDINGS — SMART CONTRACT DEPLOY ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("\nDeployer:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");

  if (balance === 0n) {
    console.error("ERROR: No POL balance. Get testnet POL first.");
    process.exit(1);
  }

  // Helper to deploy
  async function deployContract(name, args = []) {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${name}.sol`, `${name}.json`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    console.log(`\nDeploying ${name}...`);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    const addr = await contract.getAddress();
    console.log(`${name}: ${addr}`);
    return { contract, addr };
  }

  // 1. Deploy $ZENI Token
  console.log("\n═══ 1. $ZENI Token ═══");
  const { addr: zeniAddr } = await deployContract("ZeniToken", [
    wallet.address, // treasury
    wallet.address, // community
    wallet.address, // ecosystem
  ]);

  // 2. Deploy Affiliate Commission
  console.log("\n═══ 2. Affiliate Commission ═══");
  const { addr: affAddr } = await deployContract("AffiliateCommission", [zeniAddr]);

  // 3. Deploy Zeni Badge (SBT)
  console.log("\n═══ 3. Zeni Badge (SBT) ═══");
  const { addr: badgeAddr } = await deployContract("ZeniBadge", []);

  // Summary
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║         DEPLOYMENT COMPLETE             ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║ $ZENI Token:         ${zeniAddr}`);
  console.log(`║ AffiliateCommission: ${affAddr}`);
  console.log(`║ ZeniBadge (SBT):     ${badgeAddr}`);
  console.log("╚════════════════════════════════════════╝");
  console.log(`\nNEXT_PUBLIC_ZENI_TOKEN=${zeniAddr}`);
  console.log(`NEXT_PUBLIC_AFFILIATE_CONTRACT=${affAddr}`);
  console.log(`NEXT_PUBLIC_BADGE_CONTRACT=${badgeAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
