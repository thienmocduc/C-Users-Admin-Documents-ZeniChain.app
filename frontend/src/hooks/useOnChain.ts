"use client";

import { useQuery } from "@tanstack/react-query";
import { JsonRpcProvider, Contract, formatEther } from "ethers";
import {
  ZENI_TOKEN,
  TREASURY_CONTRACT,
  VESTING_CONTRACT,
  VOUCHER_CONTRACT,
  BADGE_CONTRACT,
  AFFILIATE_CONTRACT,
  POLYGON_RPC,
  ERC20_ABI,
  TREASURY_ABI,
  VESTING_ABI,
  VOUCHER_ABI,
  BADGE_ABI,
  AFFILIATE_ABI,
  ZENI_PRICE_USD,
} from "@/lib/contracts";

const provider = new JsonRpcProvider(POLYGON_RPC);

// ═══ ZENI Token Stats ═══
export function useZeniStats() {
  return useQuery({
    queryKey: ["zeni-stats"],
    queryFn: async () => {
      const token = new Contract(ZENI_TOKEN, ERC20_ABI, provider);
      const [totalSupply, name, symbol, decimals] = await Promise.all([
        token.totalSupply(),
        token.name(),
        token.symbol(),
        token.decimals(),
      ]);
      return {
        totalSupply: formatEther(totalSupply),
        totalSupplyRaw: totalSupply,
        name: name as string,
        symbol: symbol as string,
        decimals: Number(decimals),
        priceUsd: ZENI_PRICE_USD,
        fdv: Number(formatEther(totalSupply)) * ZENI_PRICE_USD,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

// ═══ ZENI Balance of address ═══
export function useZeniBalance(address: string | undefined) {
  return useQuery({
    queryKey: ["zeni-balance", address],
    queryFn: async () => {
      if (!address) return null;
      const token = new Contract(ZENI_TOKEN, ERC20_ABI, provider);
      const balance = await token.balanceOf(address);
      const formatted = formatEther(balance);
      return {
        balance: formatted,
        balanceRaw: balance,
        usdValue: Number(formatted) * ZENI_PRICE_USD,
      };
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30s
  });
}

// ═══ Treasury Info ═══
export function useTreasuryInfo() {
  return useQuery({
    queryKey: ["treasury-info"],
    queryFn: async () => {
      const treasury = new Contract(TREASURY_CONTRACT, TREASURY_ABI, provider);
      const [pools, totalLocked, activated, signer0, signer1, signer2] =
        await Promise.all([
          treasury.getGeneralPools(),
          treasury.getTotalLocked(),
          treasury.activatedCount(),
          treasury.signers(0),
          treasury.signers(1),
          treasury.signers(2),
        ]);

      return {
        founderPool: formatEther(pools[0]),
        treasuryPool: formatEther(pools[1]),
        investorPool: formatEther(pools[2]),
        ipoPool: formatEther(pools[3]),
        ecosystemPool: formatEther(pools[4]),
        totalLocked: formatEther(totalLocked),
        activatedCount: Number(activated),
        signers: [signer0 as string, signer1 as string, signer2 as string],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ═══ Treasury Subsidiary Info ═══
export function useSubsidiaryInfo(name: string) {
  return useQuery({
    queryKey: ["subsidiary-info", name],
    queryFn: async () => {
      const treasury = new Contract(TREASURY_CONTRACT, TREASURY_ABI, provider);
      const info = await treasury.getSubsidiaryInfo(name);
      return {
        activated: info[0] as boolean,
        activateRequested: info[1] as boolean,
        activateRequestTime: Number(info[2]),
        xpPool: formatEther(info[3]),
        marketingPool: formatEther(info[4]),
        teamPool: formatEther(info[5]),
        reservePool: formatEther(info[6]),
        operationsPool: formatEther(info[7]),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ═══ Vesting Info ═══
export function useVestingInfo() {
  return useQuery({
    queryKey: ["vesting-info"],
    queryFn: async () => {
      const vesting = new Contract(VESTING_CONTRACT, VESTING_ABI, provider);
      const [count, totalAllocated] = await Promise.all([
        vesting.getBeneficiaryCount(),
        vesting.totalAllocated(),
      ]);
      return {
        beneficiaryCount: Number(count),
        totalAllocated: formatEther(totalAllocated),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ═══ Vesting Schedule of address ═══
export function useVestingSchedule(address: string | undefined) {
  return useQuery({
    queryKey: ["vesting-schedule", address],
    queryFn: async () => {
      if (!address) return null;
      const vesting = new Contract(VESTING_CONTRACT, VESTING_ABI, provider);
      const isBenef = await vesting.isBeneficiary(address);
      if (!isBenef) return null;

      const [schedule, vested, claimable] = await Promise.all([
        vesting.getSchedule(address),
        vesting.getVestedAmount(address),
        vesting.getClaimableAmount(address),
      ]);

      return {
        totalAmount: formatEther(schedule[0]),
        startTime: Number(schedule[1]),
        cliffDuration: Number(schedule[2]),
        vestingDuration: Number(schedule[3]),
        claimed: formatEther(schedule[4]),
        category: schedule[5] as string,
        revoked: schedule[6] as boolean,
        revokedAmount: formatEther(schedule[7]),
        vested: formatEther(vested),
        claimable: formatEther(claimable),
      };
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// ═══ Voucher Stats ═══
export function useVoucherStats() {
  return useQuery({
    queryKey: ["voucher-stats"],
    queryFn: async () => {
      const voucher = new Contract(VOUCHER_CONTRACT, VOUCHER_ABI, provider);
      const [minted, redeemed, expired, expiry] = await Promise.all([
        voucher.totalMinted(),
        voucher.totalRedeemed(),
        voucher.totalExpired(),
        voucher.expiryDuration(),
      ]);
      return {
        totalMinted: Number(minted),
        totalRedeemed: Number(redeemed),
        totalExpired: Number(expired),
        expiryDays: Number(expiry) / 86400,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ═══ User Badges (SBT) ═══
export function useUserBadges(address: string | undefined) {
  return useQuery({
    queryKey: ["user-badges", address],
    queryFn: async () => {
      if (!address) return null;
      const badge = new Contract(BADGE_CONTRACT, BADGE_ABI, provider);
      const balance = await badge.balanceOf(address);
      const count = Number(balance);

      const badgeList = [];
      for (let i = 0; i < count; i++) {
        try {
          const tokenId = await badge.userBadges(address, i);
          const info = await badge.badges(tokenId);
          badgeList.push({
            tokenId: Number(tokenId),
            badgeType: Number(info.badgeType),
            mintedAt: Number(info.mintedAt),
            subsidiary: info.subsidiary as string,
            metadata: info.metadata as string,
          });
        } catch {
          break;
        }
      }

      return {
        totalOwned: count,
        badges: badgeList,
      };
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// ═══ Badge Global Stats ═══
export function useBadgeStats() {
  return useQuery({
    queryKey: ["badge-stats"],
    queryFn: async () => {
      const badge = new Contract(BADGE_CONTRACT, BADGE_ABI, provider);
      const total = await badge.totalBadgesMinted();
      return { totalMinted: Number(total) };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ═══ Affiliate Data ═══
export function useAffiliateData(address: string | undefined) {
  return useQuery({
    queryKey: ["affiliate-data", address],
    queryFn: async () => {
      if (!address) return null;
      const aff = new Contract(AFFILIATE_CONTRACT, AFFILIATE_ABI, provider);
      const [totalEscrow, totalReleased, totalClawedBack, commissionCount, escrowDays] =
        await Promise.all([
          aff.totalEscrow(),
          aff.totalReleased(),
          aff.totalClawedBack(),
          aff.commissionCount(),
          aff.escrowDays(),
        ]);

      // Get user commissions (first 20)
      const userComms = [];
      for (let i = 0; i < Math.min(Number(commissionCount), 20); i++) {
        try {
          const commId = await aff.userCommissions(address, i);
          const comm = await aff.commissions(commId);
          if (comm.recipient.toLowerCase() === address.toLowerCase()) {
            userComms.push({
              id: Number(commId),
              amount: formatEther(comm.amount),
              createdAt: Number(comm.createdAt),
              releaseAt: Number(comm.releaseAt),
              released: comm.released as boolean,
              clawedBack: comm.clawedBack as boolean,
              commissionType: comm.commissionType as string,
              subsidiary: comm.subsidiary as string,
            });
          }
        } catch {
          break;
        }
      }

      return {
        totalEscrow: formatEther(totalEscrow),
        totalReleased: formatEther(totalReleased),
        totalClawedBack: formatEther(totalClawedBack),
        commissionCount: Number(commissionCount),
        escrowDays: Number(escrowDays),
        userCommissions: userComms,
      };
    },
    enabled: !!address,
    staleTime: 30 * 1000,
  });
}

// ═══ Affiliate Global Stats ═══
export function useAffiliateStats() {
  return useQuery({
    queryKey: ["affiliate-stats"],
    queryFn: async () => {
      const aff = new Contract(AFFILIATE_CONTRACT, AFFILIATE_ABI, provider);
      const [totalEscrow, totalReleased, totalClawedBack, commissionCount, escrowDays] =
        await Promise.all([
          aff.totalEscrow(),
          aff.totalReleased(),
          aff.totalClawedBack(),
          aff.commissionCount(),
          aff.escrowDays(),
        ]);
      return {
        totalEscrow: formatEther(totalEscrow),
        totalReleased: formatEther(totalReleased),
        totalClawedBack: formatEther(totalClawedBack),
        commissionCount: Number(commissionCount),
        escrowDays: Number(escrowDays),
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ═══ All Contract Balances (for On-chain page) ═══
export function useAllContractBalances() {
  return useQuery({
    queryKey: ["all-contract-balances"],
    queryFn: async () => {
      const token = new Contract(ZENI_TOKEN, ERC20_ABI, provider);
      const [
        totalSupply,
        treasuryBal,
        vestingBal,
        affiliateBal,
        deployerBal,
      ] = await Promise.all([
        token.totalSupply(),
        token.balanceOf(TREASURY_CONTRACT),
        token.balanceOf(VESTING_CONTRACT),
        token.balanceOf(AFFILIATE_CONTRACT),
        token.balanceOf("0x76ABe9d6252e1e151c039F66de19DEa5d8E7CE91"),
      ]);

      return {
        totalSupply: formatEther(totalSupply),
        treasury: formatEther(treasuryBal),
        vesting: formatEther(vestingBal),
        affiliate: formatEther(affiliateBal),
        deployer: formatEther(deployerBal),
        priceUsd: ZENI_PRICE_USD,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
