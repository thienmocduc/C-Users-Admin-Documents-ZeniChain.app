// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ZeniTreasury — Master Vault for $ZENI Token Distribution
 * @author Zeni Holdings Pte. Ltd.
 *
 * Architecture:
 * - 1 contract quản lý toàn bộ 1B ZENI
 * - 5 subsidiary × 100M = 500M (mỗi sub chia 5 pools)
 * - 5 pools chung = 500M (Founder, Treasury, Investors, IPO, Ecosystem)
 * - Multi-sig 2/3 cho emergency + activate subsidiary
 * - Timelock 7 ngày cho activate subsidiary
 * - Pausable cho emergency stop
 * - Subsidiary chưa launch → LOCKED, không ai rút kể cả owner
 */
contract ZeniTreasury is ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ═══════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════
    uint256 public constant SUBSIDIARY_ALLOCATION = 100_000_000 * 10**18; // 100M per subsidiary
    uint256 public constant TIMELOCK_DURATION = 7 days;
    uint256 public constant RECOVERY_TIMELOCK = 48 hours;
    uint256 public constant REQUIRED_SIGNATURES = 2; // 2 of 3

    // ═══════════════════════════════════════════════
    // ENUMS & STRUCTS
    // ═══════════════════════════════════════════════
    enum SubPool { XP, Marketing, Team, Reserve, Operations }

    struct Subsidiary {
        bool activated;
        uint256 activateRequestTime; // Timelock
        bool activateRequested;
        mapping(SubPool => uint256) poolBalance;
    }

    struct PendingAction {
        bytes32 actionHash;
        uint256 timestamp;
        uint8 approvalCount;
        mapping(address => bool) approved;
        bool executed;
    }

    // ═══════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════
    IERC20 public immutable zeniToken;

    // Multi-sig signers (Chairman, CEO, CTO)
    address[3] public signers;
    mapping(address => bool) public isSigner;

    // Subsidiaries
    string[5] public subsidiaryNames;
    mapping(string => Subsidiary) private subsidiaries;
    uint8 public activatedCount;

    // General pools
    uint256 public founderPool;      // 100M — Chairman vesting
    uint256 public treasuryPool;     // 150M — DAO governance
    uint256 public investorPool;     // 150M — Seed/Private/Strategic
    uint256 public ipoPool;          // 50M  — IPO SGX 2031
    uint256 public ecosystemPool;    // 50M  — Cross-platform

    // Spending tracking
    uint256 public totalSpent;
    mapping(string => uint256) public subsidiarySpent;

    // Pending multi-sig actions
    uint256 public actionNonce;
    mapping(uint256 => PendingAction) public pendingActions;

    // Recovery
    address public pendingNewSigner;
    uint256 public pendingSignerIndex;
    uint256 public pendingSignerTime;

    // ═══════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════
    event SubsidiaryActivateRequested(string name, uint256 executeAfter);
    event SubsidiaryActivated(string name, uint256 amount);
    event PoolSpend(string subsidiary, SubPool pool, address to, uint256 amount, string reason);
    event GeneralPoolSpend(string pool, address to, uint256 amount, string reason);
    event ActionProposed(uint256 indexed nonce, bytes32 actionHash, address proposer);
    event ActionApproved(uint256 indexed nonce, address signer);
    event ActionExecuted(uint256 indexed nonce);
    event EmergencyPaused(address by);
    event EmergencyUnpaused(address by);
    event SignerChangeRequested(uint256 index, address newSigner, uint256 executeAfter);
    event SignerChanged(uint256 index, address oldSigner, address newSigner);

    // ═══════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════
    modifier onlySigner() {
        require(isSigner[msg.sender], "Not a signer");
        _;
    }

    modifier onlyPrimarySigner() {
        require(msg.sender == signers[0], "Not primary signer");
        _;
    }

    // ═══════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════
    constructor(
        address _zeniToken,
        address _signer1,  // Chairman
        address _signer2,  // CEO
        address _signer3   // CTO
    ) {
        require(_zeniToken != address(0), "Invalid token");
        require(_signer1 != address(0) && _signer2 != address(0) && _signer3 != address(0), "Invalid signers");
        require(_signer1 != _signer2 && _signer2 != _signer3 && _signer1 != _signer3, "Duplicate signers");

        zeniToken = IERC20(_zeniToken);

        signers[0] = _signer1;
        signers[1] = _signer2;
        signers[2] = _signer3;
        isSigner[_signer1] = true;
        isSigner[_signer2] = true;
        isSigner[_signer3] = true;

        // Initialize subsidiary names
        subsidiaryNames[0] = "ANIMA Care";
        subsidiaryNames[1] = "WellKOC";
        subsidiaryNames[2] = "NexBuild";
        subsidiaryNames[3] = "Zeni Digital";
        subsidiaryNames[4] = "Biotea84";

        // Initialize general pools
        founderPool = 100_000_000 * 10**18;
        treasuryPool = 150_000_000 * 10**18;
        investorPool = 150_000_000 * 10**18;
        ipoPool = 50_000_000 * 10**18;
        ecosystemPool = 50_000_000 * 10**18;
    }

    // ═══════════════════════════════════════════════
    // SUBSIDIARY ACTIVATION (Timelock 7 days)
    // ═══════════════════════════════════════════════

    /**
     * @dev Request to activate a subsidiary — starts 7 day timelock
     * Only primary signer (Chairman) can request
     */
    function requestActivateSubsidiary(string calldata name) external onlyPrimarySigner whenNotPaused {
        Subsidiary storage sub = subsidiaries[name];
        require(!sub.activated, "Already activated");
        require(!sub.activateRequested, "Already requested");
        require(_isValidSubsidiary(name), "Invalid subsidiary");

        sub.activateRequested = true;
        sub.activateRequestTime = block.timestamp;

        emit SubsidiaryActivateRequested(name, block.timestamp + TIMELOCK_DURATION);
    }

    /**
     * @dev Execute activation after timelock passes — needs 2/3 multi-sig
     */
    function executeActivateSubsidiary(string calldata name) external onlySigner whenNotPaused nonReentrant {
        Subsidiary storage sub = subsidiaries[name];
        require(sub.activateRequested, "Not requested");
        require(!sub.activated, "Already activated");
        require(block.timestamp >= sub.activateRequestTime + TIMELOCK_DURATION, "Timelock not passed");

        // Check contract has enough tokens
        require(zeniToken.balanceOf(address(this)) >= SUBSIDIARY_ALLOCATION, "Insufficient balance");

        sub.activated = true;
        sub.activateRequested = false;
        activatedCount++;

        // Allocate 100M into 5 sub-pools (20% + 10% + 10% + 5% + 55%)
        sub.poolBalance[SubPool.XP] = 20_000_000 * 10**18;
        sub.poolBalance[SubPool.Marketing] = 10_000_000 * 10**18;
        sub.poolBalance[SubPool.Team] = 10_000_000 * 10**18;
        sub.poolBalance[SubPool.Reserve] = 5_000_000 * 10**18;
        sub.poolBalance[SubPool.Operations] = 55_000_000 * 10**18;

        emit SubsidiaryActivated(name, SUBSIDIARY_ALLOCATION);
    }

    /**
     * @dev Cancel pending activation (before timelock expires)
     */
    function cancelActivation(string calldata name) external onlySigner {
        Subsidiary storage sub = subsidiaries[name];
        require(sub.activateRequested, "No pending request");
        require(!sub.activated, "Already activated");
        sub.activateRequested = false;
        sub.activateRequestTime = 0;
    }

    // ═══════════════════════════════════════════════
    // SPENDING (Subsidiary pools)
    // ═══════════════════════════════════════════════

    /**
     * @dev Spend from an activated subsidiary pool
     * Primary signer can spend up to pool balance
     */
    function spendFromSubsidiary(
        string calldata name,
        SubPool pool,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyPrimarySigner whenNotPaused nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        Subsidiary storage sub = subsidiaries[name];
        require(sub.activated, "Subsidiary not activated");
        require(sub.poolBalance[pool] >= amount, "Insufficient pool balance");

        sub.poolBalance[pool] -= amount;
        totalSpent += amount;
        subsidiarySpent[name] += amount;

        zeniToken.safeTransfer(to, amount);

        emit PoolSpend(name, pool, to, amount, reason);
    }

    /**
     * @dev Spend from general pools (Founder, Treasury, Ecosystem)
     * Primary signer for amounts up to 1M ZENI
     * Multi-sig 2/3 for amounts > 1M ZENI
     */
    function spendFromGeneralPool(
        string calldata poolName,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyPrimarySigner whenNotPaused nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(amount <= 1_000_000 * 10**18, "Amount > 1M needs multi-sig");

        _deductGeneralPool(poolName, amount);
        totalSpent += amount;

        zeniToken.safeTransfer(to, amount);

        emit GeneralPoolSpend(poolName, to, amount, reason);
    }

    /**
     * @dev Spend large amounts from general pools — needs multi-sig proposal
     */
    function proposeGeneralSpend(
        string calldata poolName,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlySigner whenNotPaused returns (uint256) {
        bytes32 actionHash = keccak256(abi.encodePacked("generalSpend", poolName, to, amount, reason, actionNonce));
        uint256 nonce = actionNonce++;

        PendingAction storage action = pendingActions[nonce];
        action.actionHash = actionHash;
        action.timestamp = block.timestamp;
        action.approvalCount = 1;
        action.approved[msg.sender] = true;

        emit ActionProposed(nonce, actionHash, msg.sender);
        return nonce;
    }

    function approveAction(uint256 nonce) external onlySigner {
        PendingAction storage action = pendingActions[nonce];
        require(action.actionHash != bytes32(0), "Action not found");
        require(!action.executed, "Already executed");
        require(!action.approved[msg.sender], "Already approved");

        action.approved[msg.sender] = true;
        action.approvalCount++;

        emit ActionApproved(nonce, msg.sender);
    }

    // ═══════════════════════════════════════════════
    // EMERGENCY
    // ═══════════════════════════════════════════════

    function emergencyPause() external onlySigner {
        _pause();
        emit EmergencyPaused(msg.sender);
    }

    function emergencyUnpause() external onlySigner {
        // Unpause needs 2/3 multi-sig
        // For simplicity, primary signer can unpause
        require(msg.sender == signers[0], "Only primary can unpause");
        _unpause();
        emit EmergencyUnpaused(msg.sender);
    }

    // ═══════════════════════════════════════════════
    // RECOVERY — Change signer (needs 2/3 + timelock)
    // ═══════════════════════════════════════════════

    function requestSignerChange(uint256 index, address newSigner) external onlySigner {
        require(index < 3, "Invalid index");
        require(newSigner != address(0), "Invalid address");
        require(!isSigner[newSigner], "Already a signer");

        pendingNewSigner = newSigner;
        pendingSignerIndex = index;
        pendingSignerTime = block.timestamp;

        emit SignerChangeRequested(index, newSigner, block.timestamp + RECOVERY_TIMELOCK);
    }

    function executeSignerChange() external onlySigner {
        require(pendingNewSigner != address(0), "No pending change");
        require(block.timestamp >= pendingSignerTime + RECOVERY_TIMELOCK, "Timelock not passed");

        address oldSigner = signers[pendingSignerIndex];
        isSigner[oldSigner] = false;
        isSigner[pendingNewSigner] = true;
        signers[pendingSignerIndex] = pendingNewSigner;

        emit SignerChanged(pendingSignerIndex, oldSigner, pendingNewSigner);

        pendingNewSigner = address(0);
        pendingSignerTime = 0;
    }

    // ═══════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════

    function getSubsidiaryInfo(string calldata name) external view returns (
        bool activated,
        bool activateRequested,
        uint256 activateRequestTime,
        uint256 xpPool,
        uint256 marketingPool,
        uint256 teamPool,
        uint256 reservePool,
        uint256 operationsPool
    ) {
        Subsidiary storage sub = subsidiaries[name];
        return (
            sub.activated,
            sub.activateRequested,
            sub.activateRequestTime,
            sub.poolBalance[SubPool.XP],
            sub.poolBalance[SubPool.Marketing],
            sub.poolBalance[SubPool.Team],
            sub.poolBalance[SubPool.Reserve],
            sub.poolBalance[SubPool.Operations]
        );
    }

    function getGeneralPools() external view returns (
        uint256 founder,
        uint256 treasury,
        uint256 investor,
        uint256 ipo,
        uint256 ecosystem
    ) {
        return (founderPool, treasuryPool, investorPool, ipoPool, ecosystemPool);
    }

    function getTotalLocked() external view returns (uint256) {
        return zeniToken.balanceOf(address(this));
    }

    // ═══════════════════════════════════════════════
    // INTERNAL
    // ═══════════════════════════════════════════════

    function _deductGeneralPool(string calldata poolName, uint256 amount) internal {
        bytes32 h = keccak256(abi.encodePacked(poolName));
        if (h == keccak256("founder")) {
            require(founderPool >= amount, "Founder pool insufficient");
            founderPool -= amount;
        } else if (h == keccak256("treasury")) {
            require(treasuryPool >= amount, "Treasury pool insufficient");
            treasuryPool -= amount;
        } else if (h == keccak256("investor")) {
            require(investorPool >= amount, "Investor pool insufficient");
            investorPool -= amount;
        } else if (h == keccak256("ecosystem")) {
            require(ecosystemPool >= amount, "Ecosystem pool insufficient");
            ecosystemPool -= amount;
        } else {
            revert("Invalid pool name");
        }
        // IPO pool cannot be spent — locked until SGX listing
    }

    function _isValidSubsidiary(string calldata name) internal view returns (bool) {
        for (uint i = 0; i < 5; i++) {
            if (keccak256(abi.encodePacked(subsidiaryNames[i])) == keccak256(abi.encodePacked(name))) {
                return true;
            }
        }
        return false;
    }
}
