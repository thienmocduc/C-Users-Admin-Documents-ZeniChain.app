import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || "https://polygon-bor-rpc.publicnode.com");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

  console.log("╔════════════════════════════════════════════╗");
  console.log("║  ZENI HOLDINGS — POLYGON MAINNET DEPLOY    ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("\nDeployer:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  if (balance < ethers.parseEther("0.3")) {
    console.error("WARNING: Low balance. Need ~0.5 POL for 3 contracts.");
  }

  async function deploy(name, solFile, args = []) {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", solFile, `${name}.json`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    console.log(`Deploying ${name}...`);
    const contract = await factory.deploy(...args);
    console.log("TX sent, waiting confirmation...");
    await contract.waitForDeployment();
    const addr = await contract.getAddress();
    console.log(`✅ ${name}: ${addr}\n`);
    return addr;
  }

  // 1. $ZENI Token
  console.log("═══ 1. $ZENI Token (1 billion supply) ═══");
  const zeniAddr = await deploy("ZeniToken", "ZeniToken.sol", [
    wallet.address, // treasury
    wallet.address, // community
    wallet.address, // ecosystem
  ]);

  // 2. Affiliate Commission (escrow)
  console.log("═══ 2. Affiliate Commission (escrow 7 days) ═══");
  const affAddr = await deploy("AffiliateCommission", "AffiliateCommission.sol", [zeniAddr]);

  // 3. Zeni Badge (SBT)
  console.log("═══ 3. Zeni Badge — Soul-bound NFT ═══");
  const badgeAddr = await deploy("ZeniBadge", "AnimaBadge.sol", []);

  // Final balance
  const finalBal = await provider.getBalance(wallet.address);

  console.log("╔════════════════════════════════════════════╗");
  console.log("║        DEPLOYMENT COMPLETE — MAINNET       ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log(`║ $ZENI Token:         ${zeniAddr}`);
  console.log(`║ AffiliateCommission: ${affAddr}`);
  console.log(`║ ZeniBadge (SBT):     ${badgeAddr}`);
  console.log("╠════════════════════════════════════════════╣");
  console.log(`║ Gas used: ${ethers.formatEther(balance - finalBal)} POL`);
  console.log("╚════════════════════════════════════════════╝");
  console.log(`\nView on Polygonscan:`);
  console.log(`https://polygonscan.com/address/${zeniAddr}`);
  console.log(`https://polygonscan.com/address/${affAddr}`);
  console.log(`https://polygonscan.com/address/${badgeAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
