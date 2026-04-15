◇ injected env (3) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
// Sources flattened with hardhat v3.3.0 https://hardhat.org

// SPDX-License-Identifier: MIT

// File npm/@openzeppelin/contracts@5.6.1/utils/Context.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File npm/@openzeppelin/contracts@5.6.1/access/Ownable.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/IERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File contracts/AffiliateCommission.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.28;


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

