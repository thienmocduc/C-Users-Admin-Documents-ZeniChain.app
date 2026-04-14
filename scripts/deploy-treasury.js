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

  const ZENI_TOKEN = "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1";
  const CHAIRMAN = wallet.address; // 0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91
  const CEO_RECOVERY = "0xf20Dbb66063df65c787868ef15dA4f1eBE36105a";
  const CTO_RECOVERY = "0x834E18FDaf150E9dd07dD962EAE77F7CFa342674";

  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  ZENI TREASURY — DEPLOY + DISTRIBUTE          ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("\nChairman:", CHAIRMAN);
  console.log("CEO Recovery:", CEO_RECOVERY);
  console.log("CTO Recovery:", CTO_RECOVERY);

  const polBal = await provider.getBalance(wallet.address);
  console.log("POL Balance:", ethers.formatEther(polBal), "POL\n");

  // Check ZENI balance
  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function approve(address,uint256) returns (bool)",
  ];
  const zeni = new ethers.Contract(ZENI_TOKEN, erc20Abi, wallet);
  const zeniBal = await zeni.balanceOf(wallet.address);
  console.log("ZENI Balance:", ethers.formatEther(zeniBal), "ZENI");

  // Deploy ZeniTreasury
  console.log("\n═══ Deploying ZeniTreasury ═══");
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "ZeniTreasury.sol", "ZeniTreasury.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  const treasury = await factory.deploy(
    ZENI_TOKEN,
    CHAIRMAN,
    CEO_RECOVERY,
    CTO_RECOVERY
  );
  console.log("TX sent, waiting confirmation...");
  await treasury.waitForDeployment();
  const treasuryAddr = await treasury.getAddress();
  console.log("✅ ZeniTreasury deployed:", treasuryAddr);

  // Transfer 950M ZENI to Treasury contract
  console.log("\n═══ Transferring 950M ZENI to Treasury ═══");
  const amount = ethers.parseEther("950000000"); // 950M
  const tx = await zeni.transfer(treasuryAddr, amount);
  console.log("TX sent:", tx.hash);
  await tx.wait();
  console.log("✅ 950M ZENI transferred to Treasury");

  // Verify balances
  const treasuryBal = await zeni.balanceOf(treasuryAddr);
  const deployerBal = await zeni.balanceOf(wallet.address);
  console.log("\n═══ Final Balances ═══");
  console.log("Treasury:", ethers.formatEther(treasuryBal), "ZENI");
  console.log("Deployer:", ethers.formatEther(deployerBal), "ZENI");

  // Activate ANIMA Care (request — will need 7 day wait)
  console.log("\n═══ Requesting ANIMA Care Activation ═══");
  const treasuryContract = new ethers.Contract(treasuryAddr, artifact.abi, wallet);
  const activateTx = await treasuryContract.requestActivateSubsidiary("ANIMA Care");
  await activateTx.wait();
  console.log("✅ ANIMA Care activation requested — executable after 7 days");

  const finalPolBal = await provider.getBalance(wallet.address);

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║          TREASURY DEPLOYMENT COMPLETE          ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║ ZeniTreasury: ${treasuryAddr}`);
  console.log(`║ ZENI in Treasury: 950,000,000`);
  console.log(`║ ANIMA Care: Activation pending (7 days)`);
  console.log(`║ Gas used: ${ethers.formatEther(polBal - finalPolBal)} POL`);
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║ Multi-sig signers:`);
  console.log(`║   [0] Chairman: ${CHAIRMAN}`);
  console.log(`║   [1] CEO:      ${CEO_RECOVERY}`);
  console.log(`║   [2] CTO:      ${CTO_RECOVERY}`);
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\nhttps://polygonscan.com/address/${treasuryAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
