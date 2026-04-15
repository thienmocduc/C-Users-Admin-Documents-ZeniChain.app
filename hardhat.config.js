import dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";
dotenv.config();

/** @type {import('hardhat/config').HardhatUserConfig} */
export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    amoy: {
      type: "http",
      url: process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      type: "http",
      url: process.env.POLYGON_RPC || "https://polygon-bor-rpc.publicnode.com",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  sourcify: {
    enabled: true,
  },
};
