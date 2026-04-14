// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VestingContract — Quan ly vesting $ZENI cho team va investors
 * @author Zeni Holdings Pte. Ltd. (Singapore)
 * @notice Linear vesting voi cliff period cho cac doi tuong:
 *
 * ┌──────────────────────┬───────────────┬─────────┬──────────────────┐
 * │ Pool                 │ Amount        │ Cliff   │ Vesting Duration │
 * ├──────────────────────┼───────────────┼─────────┼──────────────────┤
 * │ Founder (Chairman)   │ 100,000,000   │ 1 year  │ 5 years linear   │
 * │ Team Cong nghe       │  50,000,000   │ 1 year  │ 3 years linear   │
 * │ CEO (van hanh)       │  10,000,000   │ 1 year  │ 3 years linear   │
 * │ Team Clever          │  40,000,000   │ 1 year  │ 3 years linear   │
 * │ Investors            │ 150,000,000   │ 6 month │ 2 years linear   │
 * └──────────────────────┴───────────────┴─────────┴──────────────────┘
 *
 * Cach hoat dong:
 * 1. Owner deposit $ZENI vao contract
 * 2. Owner goi addBeneficiary() de tao vesting schedule
 * 3. Sau khi cliff ket thuc, beneficiary goi claim() de nhan token
 * 4. Token vest deu theo giay (linear) trong suot vesting duration
 * 5. Owner co the revoke() neu team member roi di — token da vest van claim duoc
 *
 * Bao mat:
 * - ReentrancyGuard chong reentrancy attack
 * - Pausable cho truong hop khan cap
 * - SafeERC20 cho moi ERC20 transfer
 * - Ownable cho access control
 */
contract VestingContract is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ═══════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════

    /// @notice Dia chi $ZENI token (Polygon Mainnet)
    IERC20 public immutable zeniToken;

    /// @notice Tong so ZENI da duoc allocate cho vesting
    uint256 public totalAllocated;

    // ═══════════════════════════════════════════════
    // DATA STRUCTURES
    // ═══════════════════════════════════════════════

    struct VestingSchedule {
        uint256 totalAmount;        // Tong so token duoc vesting
        uint256 startTime;          // Thoi diem bat dau tinh vesting
        uint256 cliffDuration;      // Thoi gian cliff (giay) — truoc cliff: 0 token
        uint256 vestingDuration;    // Tong thoi gian vesting (giay) — tinh tu startTime
        uint256 claimed;            // So token da claim
        string category;            // "founder", "tech_team", "ceo", "clever_team", "investor"
        bool revoked;               // Da bi revoke chua
        uint256 revokedAmount;      // So token bi revoke (tra lai owner)
    }

    /// @notice Mapping address => vesting schedule
    mapping(address => VestingSchedule) public vestingSchedules;

    /// @notice Danh sach tat ca beneficiaries (de iterate khi can)
    address[] public beneficiaries;

    /// @notice Check address da co vesting schedule chua
    mapping(address => bool) public isBeneficiary;

    // ═══════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════

    event BeneficiaryAdded(
        address indexed beneficiary,
        uint256 amount,
        uint256 cliffDuration,
        uint256 vestingDuration,
        string category
    );

    event TokensClaimed(
        address indexed beneficiary,
        uint256 amount
    );

    event BeneficiaryRevoked(
        address indexed beneficiary,
        uint256 unvestedAmount
    );

    event EmergencyWithdraw(
        address indexed token,
        uint256 amount
    );

    // ═══════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════

    /**
     * @param _zeniToken Dia chi $ZENI token contract
     */
    constructor(address _zeniToken) Ownable(msg.sender) {
        require(_zeniToken != address(0), "VestingContract: invalid token address");
        zeniToken = IERC20(_zeniToken);
    }

    // ═══════════════════════════════════════════════
    // OWNER FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @notice Them beneficiary vao vesting schedule
     * @dev Owner phai approve/transfer du ZENI vao contract truoc khi goi ham nay
     *
     * @param _beneficiary Dia chi nguoi nhan
     * @param _amount Tong so token (wei, 18 decimals)
     * @param _cliffDuration Thoi gian cliff tinh bang giay (VD: 365 days = 31536000)
     * @param _vestingDuration Tong thoi gian vesting tinh bang giay (VD: 3 years = 94608000)
     * @param _category Loai: "founder", "tech_team", "ceo", "clever_team", "investor"
     */
    function addBeneficiary(
        address _beneficiary,
        uint256 _amount,
        uint256 _cliffDuration,
        uint256 _vestingDuration,
        string calldata _category
    ) external onlyOwner whenNotPaused {
        require(_beneficiary != address(0), "VestingContract: invalid beneficiary");
        require(_amount > 0, "VestingContract: amount must be > 0");
        require(_vestingDuration > 0, "VestingContract: vesting duration must be > 0");
        require(_cliffDuration < _vestingDuration, "VestingContract: cliff must be < vesting duration");
        require(!isBeneficiary[_beneficiary], "VestingContract: beneficiary already exists");
        require(bytes(_category).length > 0, "VestingContract: category required");

        // Dam bao contract co du token cho allocation moi
        uint256 contractBalance = zeniToken.balanceOf(address(this));
        require(
            contractBalance >= totalAllocated + _amount,
            "VestingContract: insufficient token balance in contract"
        );

        vestingSchedules[_beneficiary] = VestingSchedule({
            totalAmount: _amount,
            startTime: block.timestamp,
            cliffDuration: _cliffDuration,
            vestingDuration: _vestingDuration,
            claimed: 0,
            category: _category,
            revoked: false,
            revokedAmount: 0
        });

        beneficiaries.push(_beneficiary);
        isBeneficiary[_beneficiary] = true;
        totalAllocated += _amount;

        emit BeneficiaryAdded(
            _beneficiary,
            _amount,
            _cliffDuration,
            _vestingDuration,
            _category
        );
    }

    /**
     * @notice Beneficiary claim token da vest
     * @dev Chi claim duoc phan da vest va chua claim truoc do
     *      ReentrancyGuard chong reentrancy khi transfer token
     */
    function claim() external nonReentrant whenNotPaused {
        require(isBeneficiary[msg.sender], "VestingContract: not a beneficiary");

        uint256 claimable = getClaimableAmount(msg.sender);
        require(claimable > 0, "VestingContract: nothing to claim");

        vestingSchedules[msg.sender].claimed += claimable;

        // SafeERC20 dam bao transfer thanh cong
        zeniToken.safeTransfer(msg.sender, claimable);

        emit TokensClaimed(msg.sender, claimable);
    }

    /**
     * @notice Revoke vesting cua mot beneficiary (VD: team member roi di)
     * @dev Token da vest van claim duoc. Chi unvested tokens bi tra lai owner.
     *
     * @param _beneficiary Dia chi bi revoke
     */
    function revoke(address _beneficiary) external onlyOwner {
        require(isBeneficiary[_beneficiary], "VestingContract: not a beneficiary");

        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        require(!schedule.revoked, "VestingContract: already revoked");

        // Tinh so token da vest tai thoi diem revoke
        uint256 vested = _computeVestedAmount(schedule);

        // Unvested = tong - da vest
        uint256 unvested = schedule.totalAmount - vested;

        // Cap nhat schedule
        schedule.revoked = true;
        schedule.revokedAmount = unvested;
        // Giam totalAmount xuong chi con phan da vest (de getVestedAmount tra dung)
        schedule.totalAmount = vested;

        // Giam totalAllocated (tra lai phan unvested)
        totalAllocated -= unvested;

        // Tra unvested tokens ve cho owner
        if (unvested > 0) {
            zeniToken.safeTransfer(owner(), unvested);
        }

        emit BeneficiaryRevoked(_beneficiary, unvested);
    }

    // ═══════════════════════════════════════════════
    // PAUSE / UNPAUSE (truong hop khan cap)
    // ═══════════════════════════════════════════════

    /**
     * @notice Tam dung contract — khong ai claim hay add beneficiary duoc
     * @dev Chi su dung khi phat hien loi bao mat
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Mo lai contract sau khi da xu ly xong van de
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ═══════════════════════════════════════════════
    // EMERGENCY (truong hop khan cap)
    // ═══════════════════════════════════════════════

    /**
     * @notice Rut token bi ket trong contract (truong hop khan cap)
     * @dev Chi rut duoc phan token CHUA allocate cho ai
     *      Dam bao khong anh huong den vesting cua beneficiaries
     *
     * @param _token Dia chi token can rut (co the la ZENI hoac token khac bi gui nham)
     * @param _amount So luong can rut
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        require(_amount > 0, "VestingContract: amount must be > 0");

        if (_token == address(zeniToken)) {
            // Chi rut phan CHUA allocate
            uint256 contractBalance = zeniToken.balanceOf(address(this));
            uint256 unallocated = contractBalance > totalAllocated
                ? contractBalance - totalAllocated
                : 0;
            require(
                _amount <= unallocated,
                "VestingContract: cannot withdraw allocated tokens"
            );
        }

        IERC20(_token).safeTransfer(owner(), _amount);

        emit EmergencyWithdraw(_token, _amount);
    }

    // ═══════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @notice Tinh tong so token da vest cua mot beneficiary
     * @dev Truoc cliff: 0. Sau cliff: linear theo giay.
     *      Sau khi het vesting duration: toan bo totalAmount.
     *
     * @param _beneficiary Dia chi can check
     * @return So token da vest (wei)
     */
    function getVestedAmount(address _beneficiary) external view returns (uint256) {
        if (!isBeneficiary[_beneficiary]) return 0;
        return _computeVestedAmount(vestingSchedules[_beneficiary]);
    }

    /**
     * @notice Tinh so token co the claim (da vest - da claim)
     *
     * @param _beneficiary Dia chi can check
     * @return So token co the claim ngay (wei)
     */
    function getClaimableAmount(address _beneficiary) public view returns (uint256) {
        if (!isBeneficiary[_beneficiary]) return 0;

        VestingSchedule storage schedule = vestingSchedules[_beneficiary];
        uint256 vested = _computeVestedAmount(schedule);

        // Claimable = da vest - da claim truoc do
        if (vested <= schedule.claimed) return 0;
        return vested - schedule.claimed;
    }

    /**
     * @notice Lay thong tin vesting schedule cua mot beneficiary
     *
     * @param _beneficiary Dia chi can check
     * @return totalAmount Tong token
     * @return startTime Thoi diem bat dau
     * @return cliffDuration Thoi gian cliff (giay)
     * @return vestingDuration Tong thoi gian vesting (giay)
     * @return claimed Da claim bao nhieu
     * @return category Loai beneficiary
     * @return revoked Da bi revoke chua
     * @return revokedAmount So token bi revoke
     */
    function getSchedule(address _beneficiary)
        external
        view
        returns (
            uint256 totalAmount,
            uint256 startTime,
            uint256 cliffDuration,
            uint256 vestingDuration,
            uint256 claimed,
            string memory category,
            bool revoked,
            uint256 revokedAmount
        )
    {
        VestingSchedule storage s = vestingSchedules[_beneficiary];
        return (
            s.totalAmount,
            s.startTime,
            s.cliffDuration,
            s.vestingDuration,
            s.claimed,
            s.category,
            s.revoked,
            s.revokedAmount
        );
    }

    /**
     * @notice Tong so beneficiaries
     */
    function getBeneficiaryCount() external view returns (uint256) {
        return beneficiaries.length;
    }

    /**
     * @notice Lay dia chi beneficiary theo index
     */
    function getBeneficiaryAt(uint256 _index) external view returns (address) {
        require(_index < beneficiaries.length, "VestingContract: index out of bounds");
        return beneficiaries[_index];
    }

    // ═══════════════════════════════════════════════
    // INTERNAL FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @dev Tinh so token da vest dua tren thoi gian hien tai
     *
     * Logic:
     * - Truoc cliff (block.timestamp < startTime + cliffDuration): return 0
     * - Sau vesting ket thuc (block.timestamp >= startTime + vestingDuration): return totalAmount
     * - Trong vesting period: linear tinh theo giay
     *   vestedAmount = totalAmount * (elapsedTime - cliffDuration) / (vestingDuration - cliffDuration)
     *
     * Vi du: Founder — 100M ZENI, cliff 1 nam, vesting 5 nam
     * - Thang 6: 0 (chua qua cliff)
     * - Nam 1: 0 (vua het cliff, bat dau vest)
     * - Nam 2: 100M * (2-1)/(5-1) = 25M
     * - Nam 3: 100M * (3-1)/(5-1) = 50M
     * - Nam 5: 100M (full vest)
     */
    function _computeVestedAmount(VestingSchedule storage _schedule)
        internal
        view
        returns (uint256)
    {
        // Chua bat dau hoac totalAmount = 0
        if (_schedule.totalAmount == 0) return 0;

        uint256 currentTime = block.timestamp;
        uint256 start = _schedule.startTime;
        uint256 cliff = _schedule.cliffDuration;
        uint256 duration = _schedule.vestingDuration;

        // Truoc cliff: 0 token
        if (currentTime < start + cliff) {
            return 0;
        }

        // Sau khi het toan bo vesting duration: vest het
        if (currentTime >= start + duration) {
            return _schedule.totalAmount;
        }

        // Trong vesting period: linear tinh tu sau cliff
        // elapsed = thoi gian da troi tu khi bat dau (KHONG phai tu khi het cliff)
        uint256 elapsed = currentTime - start;

        // Linear vesting: token vest deu tu sau cliff den het duration
        // vestingPeriod = duration - cliff (khoang thoi gian thuc su vest)
        // vestedAmount = totalAmount * (elapsed - cliff) / (duration - cliff)
        uint256 vestingPeriod = duration - cliff;
        uint256 timeAfterCliff = elapsed - cliff;

        return (_schedule.totalAmount * timeAfterCliff) / vestingPeriod;
    }
}
