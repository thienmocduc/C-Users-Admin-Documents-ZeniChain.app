// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Zeni Affiliate Commission — On-chain Escrow
 * @author Zeni Holdings Pte. Ltd.
 * @notice Quan ly hoa hong affiliate toan he sinh thai Zeni
 *
 * Ap dung cho:
 * - ANIMA Care: F1 25-30%, Group Income 20%, Pro Fee 15%, KTV Fee 15%
 * - WellKOC: KOC commission
 * - NexBuild: Referral fee
 * - Zeni Digital: Partner commission
 *
 * Flow:
 * 1. Backend ghi commission → enters escrow (hold $ZENI trong contract)
 * 2. Sau 7 ngay → permissionless release (ai cung goi duoc)
 * 3. Neu order refund → admin clawback truoc khi release
 *
 * Commission types (theo chinh sach ANIMA Care):
 * - "f1_direct": Hoa hong ban hang truc tiep (25% Buyer / 30% KOC)
 * - "group_income": 20% tong thu nhap doi tac truc tiep (chi Pro members)
 * - "pro_fee_referral": 15% phi Pro (1 lan duy nhat)
 * - "ktv_fee_referral": 15% hoc phi KTV (1 lan duy nhat)
 * - "ambassador_pool": Pool Dai Su 2% (6 cap)
 * - "bonus_*": Thuong hieu suat (admin set)
 * - "asset_*": Quy tai san (nha/xe/du lich)
 *
 * Escrow logic:
 * - $ZENI duoc hold trong contract (khong phai trong user wallet)
 * - Sau escrowDays → release tu dong khi ai do goi releaseCommission()
 * - Admin co the clawback bat ky luc nao truoc release
 * - Sau release → khong the clawback (da trong user wallet)
 *
 * On-chain transparency:
 * - Moi commission co event log → verify tren Polygonscan
 * - User co the check so du escrow bat ky luc nao
 */
contract AffiliateCommission is Ownable {
    IERC20 public zeniToken;

    struct Commission {
        address recipient;
        uint256 amount;         // So $ZENI
        uint256 createdAt;
        uint256 releaseAt;
        bool released;
        bool clawedBack;
        string commissionType;
        string subsidiary;      // "anima", "wellkoc", "nexbuild", "zenidigital"
    }

    uint256 public escrowDays = 7;
    uint256 public totalEscrow;
    uint256 public totalReleased;
    uint256 public totalClawedBack;
    uint256 public commissionCount;

    mapping(uint256 => Commission) public commissions;
    mapping(address => uint256[]) public userCommissions;

    // Track per subsidiary
    mapping(string => uint256) public subsidiaryTotalPaid;

    event CommissionCreated(
        uint256 indexed id, address indexed recipient,
        uint256 amount, string commissionType, string subsidiary
    );
    event CommissionReleased(uint256 indexed id, address indexed recipient, uint256 amount);
    event CommissionClawedBack(uint256 indexed id, address indexed recipient, uint256 amount, string reason);
    event EscrowDaysUpdated(uint256 oldDays, uint256 newDays);

    constructor(address _zeniToken) Ownable(msg.sender) {
        require(_zeniToken != address(0), "Invalid token");
        zeniToken = IERC20(_zeniToken);
    }

    /**
     * @dev Ghi commission moi (enters escrow)
     * Contract phai co du $ZENI balance
     */
    function createCommission(
        address recipient,
        uint256 amount,
        string calldata commissionType,
        string calldata subsidiary
    ) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        uint256 id = commissionCount++;
        commissions[id] = Commission({
            recipient: recipient,
            amount: amount,
            createdAt: block.timestamp,
            releaseAt: block.timestamp + (escrowDays * 1 days),
            released: false,
            clawedBack: false,
            commissionType: commissionType,
            subsidiary: subsidiary
        });

        userCommissions[recipient].push(id);
        totalEscrow += amount;

        emit CommissionCreated(id, recipient, amount, commissionType, subsidiary);
    }

    /**
     * @dev Release commission sau escrow period
     * Permissionless — ai cung goi duoc (trustless)
     */
    function releaseCommission(uint256 id) external {
        Commission storage c = commissions[id];
        require(!c.released && !c.clawedBack, "Already processed");
        require(block.timestamp >= c.releaseAt, "Still in escrow");

        c.released = true;
        totalEscrow -= c.amount;
        totalReleased += c.amount;
        subsidiaryTotalPaid[c.subsidiary] += c.amount;

        require(zeniToken.transfer(c.recipient, c.amount), "Transfer failed");
        emit CommissionReleased(id, c.recipient, c.amount);
    }

    /**
     * @dev Batch release tat ca commission du dieu kien cua 1 user
     */
    function releaseAll(address user) external {
        uint256[] memory ids = userCommissions[user];
        for (uint256 i = 0; i < ids.length; i++) {
            Commission storage c = commissions[ids[i]];
            if (!c.released && !c.clawedBack && block.timestamp >= c.releaseAt) {
                c.released = true;
                totalEscrow -= c.amount;
                totalReleased += c.amount;
                subsidiaryTotalPaid[c.subsidiary] += c.amount;
                require(zeniToken.transfer(c.recipient, c.amount), "Transfer failed");
                emit CommissionReleased(ids[i], c.recipient, c.amount);
            }
        }
    }

    /**
     * @dev Thu hoi commission (admin only)
     * Chi clawback duoc khi chua release
     */
    function clawback(uint256 id, string calldata reason) external onlyOwner {
        Commission storage c = commissions[id];
        require(!c.clawedBack, "Already clawed back");
        require(!c.released, "Already released - cannot clawback");

        c.clawedBack = true;
        totalEscrow -= c.amount;
        totalClawedBack += c.amount;

        emit CommissionClawedBack(id, c.recipient, c.amount, reason);
    }

    // ═══════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════

    function getUserCommissions(address user) external view returns (uint256[] memory) {
        return userCommissions[user];
    }

    function getUserEscrowBalance(address user) external view returns (uint256 total) {
        uint256[] memory ids = userCommissions[user];
        for (uint256 i = 0; i < ids.length; i++) {
            Commission storage c = commissions[ids[i]];
            if (!c.released && !c.clawedBack) total += c.amount;
        }
    }

    function getUserReleasedTotal(address user) external view returns (uint256 total) {
        uint256[] memory ids = userCommissions[user];
        for (uint256 i = 0; i < ids.length; i++) {
            if (commissions[ids[i]].released) total += commissions[ids[i]].amount;
        }
    }

    // ═══════════════════════════════════════════════
    // ADMIN
    // ═══════════════════════════════════════════════

    function setEscrowDays(uint256 _days) external onlyOwner {
        require(_days >= 1 && _days <= 30, "1-30 days");
        emit EscrowDaysUpdated(escrowDays, _days);
        escrowDays = _days;
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(zeniToken.transfer(owner(), amount), "Transfer failed");
    }
}
