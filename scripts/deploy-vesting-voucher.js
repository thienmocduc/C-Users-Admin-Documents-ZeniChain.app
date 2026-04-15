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

  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║  DEPLOY: VestingContract + VoucherNFT             ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("\nDeployer:", wallet.address);

  const polBal = await provider.getBalance(wallet.address);
  console.log("POL Balance:", ethers.formatEther(polBal), "POL");

  // Check ZENI balance
  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function approve(address,uint256) returns (bool)",
  ];
  const zeni = new ethers.Contract(ZENI_TOKEN, erc20Abi, wallet);
  const zeniBal = await zeni.balanceOf(wallet.address);
  console.log("ZENI Balance:", ethers.formatEther(zeniBal), "ZENI\n");

  // ═══ 1. Deploy VestingContract ═══
  console.log("═══ [1/2] Deploying VestingContract ═══");
  const vestingArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", "VestingContract.sol", "VestingContract.json"),
      "utf8"
    )
  );
  const vestingFactory = new ethers.ContractFactory(vestingArtifact.abi, vestingArtifact.bytecode, wallet);
  const vesting = await vestingFactory.deploy(ZENI_TOKEN);
  console.log("TX sent, waiting confirmation...");
  await vesting.waitForDeployment();
  const vestingAddr = await vesting.getAddress();
  console.log("✅ VestingContract deployed:", vestingAddr);

  // ═══ 2. Deploy VoucherNFT ═══
  console.log("\n═══ [2/2] Deploying VoucherNFT ═══");
  const voucherArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", "VoucherNFT.sol", "VoucherNFT.json"),
      "utf8"
    )
  );
  const voucherFactory = new ethers.ContractFactory(voucherArtifact.abi, voucherArtifact.bytecode, wallet);
  const voucher = await voucherFactory.deploy();
  console.log("TX sent, waiting confirmation...");
  await voucher.waitForDeployment();
  const voucherAddr = await voucher.getAddress();
  console.log("✅ VoucherNFT deployed:", voucherAddr);

  // ═══ 3. Transfer ZENI to VestingContract for beneficiaries ═══
  // Founder 100M + Tech Team 50M + CEO 10M + Clever Team 40M = 200M
  // Investors 150M se transfer sau khi co investor wallet
  console.log("\n═══ Transferring 200M ZENI to VestingContract ═══");
  const vestingAmount = ethers.parseEther("200000000"); // 200M for team vesting
  const currentBal = await zeni.balanceOf(wallet.address);

  if (currentBal >= vestingAmount) {
    const tx = await zeni.transfer(vestingAddr, vestingAmount);
    console.log("TX sent:", tx.hash);
    await tx.wait();
    console.log("✅ 200M ZENI transferred to VestingContract");
  } else {
    console.log("⚠️ Deployer ZENI balance insufficient for vesting transfer");
    console.log("   Need:", ethers.formatEther(vestingAmount), "ZENI");
    console.log("   Have:", ethers.formatEther(currentBal), "ZENI");
    console.log("   → Transfer ZENI to VestingContract manually later");
  }

  // ═══ Summary ═══
  const finalPolBal = await provider.getBalance(wallet.address);
  const gasUsed = polBal - finalPolBal;

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║          DEPLOYMENT COMPLETE                      ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║ VestingContract: ${vestingAddr}`);
  console.log(`║ VoucherNFT:      ${voucherAddr}`);
  console.log(`║ Gas used:        ${ethers.formatEther(gasUsed)} POL`);
  console.log("╠══════════════════════════════════════════════════╣");
  console.log("║ Next steps:");
  console.log("║ 1. addBeneficiary() cho Founder, Tech, CEO, Clever");
  console.log("║ 2. Verify contracts on Polygonscan");
  console.log("║ 3. Update frontend contracts.ts");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`\nhttps://polygonscan.com/address/${vestingAddr}`);
  console.log(`https://polygonscan.com/address/${voucherAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
