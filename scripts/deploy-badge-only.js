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
  console.log("Balance:", ethers.formatEther(balance), "POL");

  // Deploy only ZeniBadge (smallest contract, cheapest gas)
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "AnimaBadge.sol", "ZeniBadge.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Deploying ZeniBadge...");
  const contract = await factory.deploy({ gasLimit: 3000000 });
  await contract.waitForDeployment();
  console.log("ZeniBadge:", await contract.getAddress());
}

main().catch(console.error);
