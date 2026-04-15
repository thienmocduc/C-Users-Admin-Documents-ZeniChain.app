// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VoucherNFT — Transferable Voucher NFT cho Zeni Ecosystem
 * @author Zeni Holdings Pte. Ltd. (Singapore)
 * @notice Voucher NFT co the chuyen nhuong, ban/tang, het han, burn khi dung
 *
 * Flow (Chairman approved):
 * 1. User co XP → Backend goi mintVoucher() → user nhan NFT voucher
 * 2. User co the: tu dung (ap don hang) HOAC ban lai (marketplace)
 * 3. Khi dung: backend goi redeemVoucher() → voucher burn on-chain
 * 4. Voucher het han sau expiryDuration (default 30 ngay)
 *
 * Khac voi ZeniBadge (SBT):
 * - Badge: KHONG transfer, vinh vien, thanh tich
 * - Voucher: CO transfer, het han, giam gia don hang, burn khi dung
 *
 * Voucher chi KHAT TRU vao don hang — KHONG doi truc tiep san pham
 * User van phai mua hang, voucher chi giam gia
 *
 * Categories:
 * ┌──────────────┬────────┬──────────────────────────┐
 * │ Type         │ Value  │ Usage                     │
 * ├──────────────┼────────┼──────────────────────────┤
 * │ discount_10  │ 10%    │ Giam 10% don hang         │
 * │ discount_20  │ 20%    │ Giam 20% don hang         │
 * │ discount_30  │ 30%    │ Giam 30% don hang         │
 * │ discount_40  │ 40%    │ Giam 40% don hang         │
 * │ discount_50  │ 50%    │ Giam 50% don hang         │
 * │ free_service │ 100%   │ Mien phi 1 dich vu        │
 * │ cash_value   │ Fixed  │ Giam co dinh (VD: 500K)   │
 * └──────────────┴────────┴──────────────────────────┘
 *
 * Cross-platform: ANIMA Care, WellKOC, Biotea84, NexBuild, Zeni Digital
 */
contract VoucherNFT is ERC721, Ownable, Pausable, ReentrancyGuard {

    // ═══════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════

    uint256 public constant MAX_SUPPLY = 1_000_000; // 1 trieu voucher toi da
    uint256 public constant MAX_MINT_BATCH = 50;     // Gioi han batch mint

    // ═══════════════════════════════════════════════
    // DATA STRUCTURES
    // ═══════════════════════════════════════════════

    struct Voucher {
        uint256 voucherType;     // Loai voucher (1=10%, 2=20%, 3=30%, 4=40%, 5=50%, 6=free, 7=cash)
        uint256 value;           // Gia tri (phan tram hoac so tien co dinh, 18 decimals)
        uint256 mintedAt;        // Thoi diem mint
        uint256 expiresAt;       // Thoi diem het han
        string subsidiary;      // "anima", "wellkoc", "nexbuild", "zenidigital", "biotea84"
        string metadata;         // JSON metadata (ten, mo ta, hinh anh)
        bool redeemed;           // Da dung chua
        uint256 redeemedAt;      // Thoi diem dung
        string redeemedOrderId;  // Ma don hang khi dung
    }

    // ═══════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════

    uint256 private _nextTokenId;
    uint256 public totalMinted;
    uint256 public totalRedeemed;
    uint256 public totalExpired;

    /// @notice Thoi han voucher (mac dinh 30 ngay)
    uint256 public expiryDuration = 30 days;

    /// @notice XP cost de mint voucher theo type
    mapping(uint256 => uint256) public xpCostPerType;

    /// @notice Token ID => Voucher data
    mapping(uint256 => Voucher) public vouchers;

    /// @notice User => danh sach voucher IDs
    mapping(address => uint256[]) public userVouchers;

    /// @notice Subsidiary => tong voucher da mint
    mapping(string => uint256) public subsidiaryVoucherCount;

    /// @notice Subsidiary => tong voucher da dung
    mapping(string => uint256) public subsidiaryRedeemedCount;

    /// @notice Authorized minters (backend services)
    mapping(address => bool) public authorizedMinters;

    // ═══════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════

    event VoucherMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 voucherType,
        uint256 value,
        uint256 expiresAt,
        string subsidiary
    );

    event VoucherRedeemed(
        address indexed owner,
        uint256 indexed tokenId,
        string orderId,
        string subsidiary
    );

    event VoucherBurned(
        uint256 indexed tokenId,
        string reason
    );

    event ExpiryDurationUpdated(uint256 oldDuration, uint256 newDuration);
    event MinterUpdated(address indexed minter, bool authorized);
    event XpCostUpdated(uint256 voucherType, uint256 xpCost);

    // ═══════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "VoucherNFT: not authorized"
        );
        _;
    }

    // ═══════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════

    constructor() ERC721("Zeni Voucher", "ZVOUCHER") Ownable(msg.sender) {
        // Default XP costs per voucher type
        xpCostPerType[1] = 500;    // 10% discount = 500 XP
        xpCostPerType[2] = 1000;   // 20% discount = 1000 XP
        xpCostPerType[3] = 2000;   // 30% discount = 2000 XP
        xpCostPerType[4] = 3500;   // 40% discount = 3500 XP
        xpCostPerType[5] = 5000;   // 50% discount = 5000 XP
        xpCostPerType[6] = 10000;  // Free service = 10000 XP
        xpCostPerType[7] = 0;      // Cash value = admin set
    }

    // ═══════════════════════════════════════════════
    // MINT FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @notice Mint 1 voucher cho user
     * @dev Backend verify XP balance truoc khi goi
     *
     * @param to Dia chi user nhan voucher
     * @param voucherType Loai voucher (1-7)
     * @param value Gia tri voucher (% hoac so tien)
     * @param subsidiary Platform phat hanh
     * @param metadata JSON metadata
     */
    function mintVoucher(
        address to,
        uint256 voucherType,
        uint256 value,
        string calldata subsidiary,
        string calldata metadata
    ) external onlyAuthorized whenNotPaused returns (uint256) {
        require(to != address(0), "VoucherNFT: invalid recipient");
        require(voucherType >= 1 && voucherType <= 7, "VoucherNFT: invalid type");
        require(value > 0, "VoucherNFT: value must be > 0");
        require(totalMinted < MAX_SUPPLY, "VoucherNFT: max supply reached");
        require(bytes(subsidiary).length > 0, "VoucherNFT: subsidiary required");

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);

        uint256 expiry = block.timestamp + expiryDuration;

        vouchers[tokenId] = Voucher({
            voucherType: voucherType,
            value: value,
            mintedAt: block.timestamp,
            expiresAt: expiry,
            subsidiary: subsidiary,
            metadata: metadata,
            redeemed: false,
            redeemedAt: 0,
            redeemedOrderId: ""
        });

        userVouchers[to].push(tokenId);
        subsidiaryVoucherCount[subsidiary]++;
        totalMinted++;

        emit VoucherMinted(to, tokenId, voucherType, value, expiry, subsidiary);
        return tokenId;
    }

    /**
     * @notice Batch mint nhieu vouchers (tiet kiem gas)
     */
    function batchMintVouchers(
        address[] calldata recipients,
        uint256[] calldata types,
        uint256[] calldata values,
        string[] calldata subsidiaries,
        string[] calldata metadatas
    ) external onlyAuthorized whenNotPaused {
        uint256 len = recipients.length;
        require(
            len == types.length && len == values.length &&
            len == subsidiaries.length && len == metadatas.length,
            "VoucherNFT: array length mismatch"
        );
        require(len <= MAX_MINT_BATCH, "VoucherNFT: batch too large");
        require(totalMinted + len <= MAX_SUPPLY, "VoucherNFT: exceeds max supply");

        for (uint256 i = 0; i < len; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(recipients[i], tokenId);

            uint256 expiry = block.timestamp + expiryDuration;
            vouchers[tokenId] = Voucher({
                voucherType: types[i],
                value: values[i],
                mintedAt: block.timestamp,
                expiresAt: expiry,
                subsidiary: subsidiaries[i],
                metadata: metadatas[i],
                redeemed: false,
                redeemedAt: 0,
                redeemedOrderId: ""
            });

            userVouchers[recipients[i]].push(tokenId);
            subsidiaryVoucherCount[subsidiaries[i]]++;
            totalMinted++;

            emit VoucherMinted(recipients[i], tokenId, types[i], values[i], expiry, subsidiaries[i]);
        }
    }

    // ═══════════════════════════════════════════════
    // REDEEM (Dung voucher — burn on-chain)
    // ═══════════════════════════════════════════════

    /**
     * @notice Dung voucher vao don hang — burn NFT
     * @dev Backend goi khi user ap voucher vao don hang
     *      Chi owner cua voucher hoac authorized minter moi goi duoc
     *
     * @param tokenId ID cua voucher
     * @param orderId Ma don hang (tracking)
     */
    function redeemVoucher(
        uint256 tokenId,
        string calldata orderId
    ) external onlyAuthorized whenNotPaused nonReentrant {
        require(_ownerOf(tokenId) != address(0), "VoucherNFT: voucher does not exist");

        Voucher storage v = vouchers[tokenId];
        require(!v.redeemed, "VoucherNFT: already redeemed");
        require(block.timestamp <= v.expiresAt, "VoucherNFT: expired");
        require(bytes(orderId).length > 0, "VoucherNFT: orderId required");

        address voucherOwner = ownerOf(tokenId);

        // Mark as redeemed
        v.redeemed = true;
        v.redeemedAt = block.timestamp;
        v.redeemedOrderId = orderId;
        totalRedeemed++;
        subsidiaryRedeemedCount[v.subsidiary]++;

        // Burn the NFT
        _burn(tokenId);

        emit VoucherRedeemed(voucherOwner, tokenId, orderId, v.subsidiary);
    }

    /**
     * @notice Burn voucher het han (admin cleanup)
     * @dev Bat ky ai cung goi duoc cho voucher da het han (trustless)
     */
    function burnExpired(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "VoucherNFT: does not exist");

        Voucher storage v = vouchers[tokenId];
        require(!v.redeemed, "VoucherNFT: already redeemed");
        require(block.timestamp > v.expiresAt, "VoucherNFT: not expired yet");

        totalExpired++;
        _burn(tokenId);

        emit VoucherBurned(tokenId, "expired");
    }

    /**
     * @notice Batch burn het han
     */
    function batchBurnExpired(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_ownerOf(tokenIds[i]) != address(0)) {
                Voucher storage v = vouchers[tokenIds[i]];
                if (!v.redeemed && block.timestamp > v.expiresAt) {
                    totalExpired++;
                    _burn(tokenIds[i]);
                    emit VoucherBurned(tokenIds[i], "expired");
                }
            }
        }
    }

    // ═══════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @notice Lay danh sach voucher cua user
     */
    function getUserVouchers(address user) external view returns (uint256[] memory) {
        return userVouchers[user];
    }

    /**
     * @notice Lay thong tin chi tiet voucher
     */
    function getVoucherInfo(uint256 tokenId) external view returns (
        uint256 voucherType,
        uint256 value,
        uint256 mintedAt,
        uint256 expiresAt,
        string memory subsidiary,
        string memory metadata,
        bool redeemed,
        bool expired,
        address currentOwner
    ) {
        Voucher storage v = vouchers[tokenId];
        address own = _ownerOf(tokenId);
        return (
            v.voucherType,
            v.value,
            v.mintedAt,
            v.expiresAt,
            v.subsidiary,
            v.metadata,
            v.redeemed,
            block.timestamp > v.expiresAt,
            own
        );
    }

    /**
     * @notice Dem voucher active (chua dung, chua het han) cua user
     */
    function getUserActiveVoucherCount(address user) external view returns (uint256 count) {
        uint256[] memory ids = userVouchers[user];
        for (uint256 i = 0; i < ids.length; i++) {
            if (_ownerOf(ids[i]) != address(0)) {
                Voucher storage v = vouchers[ids[i]];
                if (!v.redeemed && block.timestamp <= v.expiresAt) {
                    count++;
                }
            }
        }
    }

    /**
     * @notice Check voucher con valid khong
     */
    function isVoucherValid(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        Voucher storage v = vouchers[tokenId];
        return !v.redeemed && block.timestamp <= v.expiresAt;
    }

    /**
     * @notice Lay XP cost cho 1 loai voucher
     */
    function getXpCost(uint256 voucherType) external view returns (uint256) {
        return xpCostPerType[voucherType];
    }

    // ═══════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════

    /**
     * @notice Cap nhat thoi han voucher
     */
    function setExpiryDuration(uint256 _duration) external onlyOwner {
        require(_duration >= 7 days && _duration <= 365 days, "VoucherNFT: 7-365 days");
        emit ExpiryDurationUpdated(expiryDuration, _duration);
        expiryDuration = _duration;
    }

    /**
     * @notice Them/xoa authorized minter (backend service)
     */
    function setAuthorizedMinter(address _minter, bool _authorized) external onlyOwner {
        require(_minter != address(0), "VoucherNFT: invalid minter");
        authorizedMinters[_minter] = _authorized;
        emit MinterUpdated(_minter, _authorized);
    }

    /**
     * @notice Cap nhat XP cost cho voucher type
     */
    function setXpCost(uint256 _voucherType, uint256 _xpCost) external onlyOwner {
        require(_voucherType >= 1 && _voucherType <= 7, "VoucherNFT: invalid type");
        xpCostPerType[_voucherType] = _xpCost;
        emit XpCostUpdated(_voucherType, _xpCost);
    }

    /**
     * @notice Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
