/**
 * Verify all contracts via Sourcify API using metadata + sources
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHAIN_ID = "137";

const CONTRACTS = [
  {
    name: "ZeniToken",
    address: "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1",
    artifactPath: "artifacts/contracts/ZeniToken.sol/ZeniToken.json",
    contractFile: "contracts/ZeniToken.sol",
  },
  {
    name: "AffiliateCommission",
    address: "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714",
    artifactPath: "artifacts/contracts/AffiliateCommission.sol/AffiliateCommission.json",
    contractFile: "contracts/AffiliateCommission.sol",
  },
  {
    name: "ZeniBadge",
    address: "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D",
    artifactPath: "artifacts/contracts/AnimaBadge.sol/ZeniBadge.json",
    contractFile: "contracts/AnimaBadge.sol",
  },
  {
    name: "ZeniTreasury",
    address: "0x359E7Bc28023D8f8906D0Fa7c18Ce60E6b5f1448",
    artifactPath: "artifacts/contracts/ZeniTreasury.sol/ZeniTreasury.json",
    contractFile: "contracts/ZeniTreasury.sol",
  },
  {
    name: "VestingContract",
    address: "0xD51C4816B5B932fE2dea8DfD082878A9146Ad00a",
    artifactPath: "artifacts/contracts/VestingContract.sol/VestingContract.json",
    contractFile: "contracts/VestingContract.sol",
  },
  {
    name: "VoucherNFT",
    address: "0x64D880F84d1A1212F876eb8F150cdca91857e1DF",
    artifactPath: "artifacts/contracts/VoucherNFT.sol/VoucherNFT.json",
    contractFile: "contracts/VoucherNFT.sol",
  },
];

// Recursively find all source files referenced in the metadata
function findSourceFiles(contractFile, rootDir, collected = new Set()) {
  if (collected.has(contractFile)) return;
  collected.add(contractFile);

  let fullPath;
  if (contractFile.startsWith("@")) {
    fullPath = path.join(rootDir, "node_modules", contractFile);
  } else {
    fullPath = path.join(rootDir, contractFile);
  }

  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, "utf8");
  const importRegex = /import\s+.*?"(.+?)"/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      importPath = path.posix.join(path.posix.dirname(contractFile), importPath);
    }
    findSourceFiles(importPath, rootDir, collected);
  }
}

async function verifyContract(contract, rootDir) {
  console.log(`\n═══ Verifying ${contract.name} ═══`);

  const artifactFullPath = path.join(rootDir, contract.artifactPath);
  if (!fs.existsSync(artifactFullPath)) {
    console.log(`❌ Artifact not found: ${contract.artifactPath}`);
    return false;
  }

  // Read artifact to get metadata
  const artifact = JSON.parse(fs.readFileSync(artifactFullPath, "utf8"));

  // Extract metadata from artifact (Hardhat 3 stores it in the artifact)
  let metadata;
  if (artifact.metadata) {
    metadata = typeof artifact.metadata === "string" ? artifact.metadata : JSON.stringify(artifact.metadata);
  } else {
    // Try to build metadata from what we have
    console.log(`⚠️ No metadata in artifact, trying build artifacts...`);

    // Check for build-info
    const buildInfoDir = path.join(rootDir, "artifacts", "build-info");
    if (fs.existsSync(buildInfoDir)) {
      const buildFiles = fs.readdirSync(buildInfoDir).filter(f => f.endsWith(".json"));
      for (const bf of buildFiles) {
        const buildInfo = JSON.parse(fs.readFileSync(path.join(buildInfoDir, bf), "utf8"));
        const output = buildInfo?.output?.contracts;
        if (output) {
          for (const [filePath, contracts] of Object.entries(output)) {
            for (const [name, data] of Object.entries(contracts)) {
              if (name === contract.name && data.metadata) {
                metadata = data.metadata;
                break;
              }
            }
            if (metadata) break;
          }
        }
        if (metadata) break;
      }
    }
  }

  if (!metadata) {
    console.log(`❌ Cannot find metadata for ${contract.name}`);
    return false;
  }

  // Collect source files
  const sourceFiles = new Set();
  findSourceFiles(contract.contractFile, rootDir, sourceFiles);

  // Build FormData
  const formData = new FormData();
  formData.append("address", contract.address);
  formData.append("chain", CHAIN_ID);

  // Add metadata.json
  const metadataBlob = new Blob([metadata], { type: "application/json" });
  formData.append("files", metadataBlob, "metadata.json");

  // Add source files
  for (const sf of sourceFiles) {
    let fullPath;
    if (sf.startsWith("@")) {
      fullPath = path.join(rootDir, "node_modules", sf);
    } else {
      fullPath = path.join(rootDir, sf);
    }
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      const blob = new Blob([content], { type: "text/plain" });
      formData.append("files", blob, sf);
    }
  }

  try {
    const res = await fetch("https://sourcify.dev/server/verify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.result) {
      const status = data.result[0]?.status;
      if (status === "perfect" || status === "partial") {
        console.log(`✅ ${contract.name} verified! Status: ${status}`);
        console.log(`   https://sourcify.dev/#/lookup/${contract.address}`);
        return true;
      }
    }

    // Check if already verified
    if (data.error && data.error.includes("already")) {
      console.log(`✅ ${contract.name} already verified!`);
      return true;
    }

    console.log(`⚠️ Response: ${JSON.stringify(data).slice(0, 300)}`);
    return false;
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║  SOURCIFY VERIFICATION — ALL CONTRACTS            ║");
  console.log("╚══════════════════════════════════════════════════╝");

  let verified = 0;
  let failed = 0;

  for (const contract of CONTRACTS) {
    const success = await verifyContract(contract, rootDir);
    if (success) verified++;
    else failed++;
  }

  console.log("\n═══════════════════════════════════════════");
  console.log(`Results: ${verified} verified, ${failed} failed`);

  if (failed > 0) {
    console.log("\nFailed contracts can be verified manually:");
    console.log("→ polygonscan.com/verifyContract");
    console.log("→ Use flattened source: contracts/*_flat.sol");
    console.log("→ Compiler: 0.8.28, Optimizer: Yes (200), EVM: cancun");
  }
  console.log("═══════════════════════════════════════════");
}

main().catch(console.error);
