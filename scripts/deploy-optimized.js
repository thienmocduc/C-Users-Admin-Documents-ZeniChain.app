import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

  console.log("Deployer:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  // Use low gas price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice * 80n / 100n; // 80% of suggested
  console.log("Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei\n");

  async function deploy(name, solFile, args = []) {
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", solFile, `${name}.json`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    console.log(`Deploying ${name}...`);
    const contract = await factory.deploy(...args, { gasPrice });
    await contract.waitForDeployment();
    const addr = await contract.getAddress();
    console.log(`✅ ${name}: ${addr}\n`);
    return addr;
  }

  // Deploy in order
  const zeniAddr = await deploy("ZeniToken", "ZeniToken.sol", [wallet.address, wallet.address, wallet.address]);
  const affAddr = await deploy("AffiliateCommission", "AffiliateCommission.sol", [zeniAddr]);
  const badgeAddr = await deploy("ZeniBadge", "AnimaBadge.sol", []);

  console.log("╔════════════════════════════════════╗");
  console.log("║     DEPLOYMENT COMPLETE            ║");
  console.log("╠════════════════════════════════════╣");
  console.log(`║ $ZENI:     ${zeniAddr}`);
  console.log(`║ Affiliate: ${affAddr}`);
  console.log(`║ Badge:     ${badgeAddr}`);
  console.log("╚════════════════════════════════════╝");
}

main().catch(console.error);
