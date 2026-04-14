// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title $ZENI — Native Coin of Zeni Holdings Ecosystem
 * @author Zeni Holdings Pte. Ltd. (Singapore)
 * @notice Governance + Utility coin cho toan bo he sinh thai Zeni
 *
 * Zeni Holdings subsidiaries:
 * - ANIMA Care Global (Wellness & Traditional Medicine)
 * - WellKOC (Social Commerce)
 * - NexBuild Holdings (Construction & Real Estate)
 * - Zeni Digital (Enterprise AI & SaaS)
 *
 * $ZENI la coin duy nhat cua he sinh thai — KHONG co sub-token rieng.
 * Moi subsidiary co XP/Points rieng (off-chain) nhung convert ve $ZENI.
 *
 * Use cases:
 * - Gas fee tren Zeni AppChain (khi migrate sang native chain)
 * - Governance voting (1 ZENI = 1 vote, Founder Class = 10x)
 * - Community rewards (XP → ZENI conversion)
 * - Payment cho dich vu cross-platform
 * - Staking earn passive yield
 * - NFT Voucher minting fee
 *
 * Total supply: 1,000,000,000 (1 billion) — Hard cap, KHONG mint them
 *
 * Allocation:
 * ┌────────────────────┬──────┬───────────────┐
 * │ Purpose            │  %   │ Amount        │
 * ├────────────────────┼──────┼───────────────┤
 * │ Community Rewards  │ 30%  │ 300,000,000   │
 * │ Treasury / DAO     │ 20%  │ 200,000,000   │
 * │ Investors          │ 20%  │ 200,000,000   │
 * │ Team & Founders    │ 15%  │ 150,000,000   │
 * │ Ecosystem Fund     │ 10%  │ 100,000,000   │
 * │ Public / IPO SGX   │  5%  │  50,000,000   │
 * └────────────────────┴──────┴───────────────┘
 *
 * Chairman allocation: 10% = 100,000,000 $ZENI
 * Founder Class voting: 1 token = 10 votes (dual-class)
 *
 * XP → ZENI conversion:
 * - Dynamic rate = Community_Pool_Balance / Total_XP_Outstanding
 * - Khoi diem: 1,000 XP = 1 ZENI
 * - Rate tu dieu chinh theo cung cau — khong hyperinflate
 *
 * Giai doan 1: ERC-20 tren Polygon (testnet Amoy → mainnet)
 * Giai doan 2: Native coin tren Zeni AppChain (Polygon CDK)
 * IPO SGX 2031: $ZENI la utility token, co phan Zeni Holdings list rieng
 */
contract ZeniToken is ERC20, ERC20Burnable, Ownable {

    // ═══════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant COMMUNITY_ALLOCATION = 300_000_000 * 10**18;
    uint256 public constant TREASURY_ALLOCATION = 200_000_000 * 10**18;

    // XP conversion: 1000 XP = 1 ZENI (adjustable by governance)
    uint256 public xpPerZeni = 1000;

    // ═══════════════════════════════════════════════
    // POOL ADDRESSES
    // ═══════════════════════════════════════════════
    address public communityPool;   // 30% — XP rewards, gamification
    address public treasuryPool;    // 20% — operations, DAO
    address public ecosystemFund;   // 10% — partnerships, grants

    // ═══════════════════════════════════════════════
    // TRACKING
    // ═══════════════════════════════════════════════
    uint256 public communityDistributed;
    uint256 public totalXpConverted;

    // Subsidiary XP tracking (for cross-platform conversion)
    mapping(string => uint256) public subsidiaryXpPool;
    // "anima", "wellkoc", "nexbuild", "zenidigital"

    // ═══════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════
    event CommunityReward(address indexed to, uint256 zeniAmount, uint256 xpBurned, string subsidiary, string reason);
    event XpConversion(address indexed user, uint256 xpAmount, uint256 zeniAmount, string subsidiary);
    event PoolUpdated(string pool, address newAddress);
    event XpRateUpdated(uint256 oldRate, uint256 newRate);
    event SubsidiaryXpAdded(string subsidiary, uint256 amount);

    // ═══════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════
    constructor(
        address _treasury,
        address _community,
        address _ecosystem
    ) ERC20("Zeni", "ZENI") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        require(_community != address(0), "Invalid community");
        require(_ecosystem != address(0), "Invalid ecosystem");

        treasuryPool = _treasury;
        communityPool = _community;
        ecosystemFund = _ecosystem;

        // Mint to pools
        _mint(_community, COMMUNITY_ALLOCATION);       // 30% community
        _mint(_treasury, TREASURY_ALLOCATION);          // 20% treasury
        _mint(_ecosystem, 100_000_000 * 10**18);        // 10% ecosystem
        _mint(msg.sender, 350_000_000 * 10**18);        // 35% (investors 20% + team 15%) — owner distributes via vesting
        // Remaining 5% (50M) minted when IPO SGX listing
    }

    // ═══════════════════════════════════════════════
    // COMMUNITY REWARDS
    // ═══════════════════════════════════════════════

    /**
     * @dev Distribute ZENI from community pool as reward
     * Called by backend when user earns XP and converts
     */
    function distributeReward(
        address to,
        uint256 amount,
        string calldata subsidiary,
        string calldata reason
    ) external {
        require(msg.sender == communityPool || msg.sender == owner(), "Not authorized");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(communityPool) >= amount, "Community pool insufficient");

        _transfer(communityPool, to, amount);
        communityDistributed += amount;

        emit CommunityReward(to, amount, 0, subsidiary, reason);
    }

    /**
     * @dev Convert XP to ZENI
     * Rate: xpPerZeni XP = 1 ZENI (default 1000:1)
     */
    function convertXpToZeni(
        address to,
        uint256 xpAmount,
        string calldata subsidiary
    ) external {
        require(msg.sender == communityPool || msg.sender == owner(), "Not authorized");
        require(to != address(0), "Invalid recipient");
        require(xpAmount >= xpPerZeni, "Not enough XP");

        uint256 zeniAmount = (xpAmount * 10**18) / xpPerZeni;
        require(balanceOf(communityPool) >= zeniAmount, "Community pool insufficient");

        _transfer(communityPool, to, zeniAmount);
        communityDistributed += zeniAmount;
        totalXpConverted += xpAmount;

        emit XpConversion(to, xpAmount, zeniAmount, subsidiary);
    }

    // ═══════════════════════════════════════════════
    // GOVERNANCE (owner only)
    // ═══════════════════════════════════════════════

    function setXpRate(uint256 _newRate) external onlyOwner {
        require(_newRate >= 100 && _newRate <= 100000, "Rate 100-100000");
        uint256 oldRate = xpPerZeni;
        xpPerZeni = _newRate;
        emit XpRateUpdated(oldRate, _newRate);
    }

    function setCommunityPool(address _new) external onlyOwner {
        require(_new != address(0), "Invalid");
        communityPool = _new;
        emit PoolUpdated("community", _new);
    }

    function setTreasuryPool(address _new) external onlyOwner {
        require(_new != address(0), "Invalid");
        treasuryPool = _new;
        emit PoolUpdated("treasury", _new);
    }

    function setEcosystemFund(address _new) external onlyOwner {
        require(_new != address(0), "Invalid");
        ecosystemFund = _new;
        emit PoolUpdated("ecosystem", _new);
    }

    /**
     * @dev Mint remaining IPO allocation (5% = 50M)
     * One-time call when listing on SGX
     */
    function mintIpoAllocation(address _ipoPool) external onlyOwner {
        require(_ipoPool != address(0), "Invalid");
        require(totalSupply() + 50_000_000 * 10**18 <= MAX_SUPPLY, "Exceeds max supply");
        _mint(_ipoPool, 50_000_000 * 10**18);
    }

    // ═══════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════

    function communityPoolBalance() external view returns (uint256) {
        return balanceOf(communityPool);
    }

    function treasuryBalance() external view returns (uint256) {
        return balanceOf(treasuryPool);
    }

    function currentXpRate() external view returns (uint256) {
        return xpPerZeni;
    }

    /**
     * @dev Calculate how much ZENI a user would get for X XP
     */
    function previewXpConversion(uint256 xpAmount) external view returns (uint256) {
        if (xpAmount < xpPerZeni) return 0;
        return (xpAmount * 10**18) / xpPerZeni;
    }
}
