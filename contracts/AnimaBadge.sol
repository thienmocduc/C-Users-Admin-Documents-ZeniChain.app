// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Zeni Achievement Badge — Soul-bound NFT (SBT)
 * @author Zeni Holdings Pte. Ltd.
 * @notice Non-transferable achievement badges cho toan he sinh thai
 *
 * Soul-bound = KHONG transfer, KHONG ban, KHONG cho — chi earn duoc
 *
 * Badge categories:
 * ┌──────────────┬──────────────────────────────────────┐
 * │ Category     │ Badges                                │
 * ├──────────────┼──────────────────────────────────────┤
 * │ Check-in     │ First Check-in, Week Warrior, Month  │
 * │ Booking      │ First Booking, Loyal Customer (5x)    │
 * │ Order        │ First Order, Shopaholic (10x)         │
 * │ Review       │ First Review, Reviewer Pro (5x)       │
 * │ AI Scan      │ AI Explorer (first tongue scan)       │
 * │ Affiliate    │ Referrer, Ambassador (5+ referrals)   │
 * │ XP Milestone │ 1K, 5K, 10K, 50K, 100K XP           │
 * │ Rank         │ Dai Su → Thien Long (6 ranks SBT)    │
 * │ Special      │ Legendary (custom, chairman only)     │
 * └──────────────┴──────────────────────────────────────┘
 *
 * Cross-platform: 1 badge contract cho ANIMA + WellKOC + NexBuild + Zeni Digital
 * Subsidiary stored in metadata — filter UI theo subsidiary
 *
 * On-chain: verify badge tren Polygonscan bat ky luc nao
 * Legal: SBT = performance record, KHONG phai financial instrument
 */
contract ZeniBadge is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct Badge {
        uint256 badgeType;
        uint256 mintedAt;
        string subsidiary;  // "anima", "wellkoc", "nexbuild", "zenidigital", "zeni"
        string metadata;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(uint256 => bool)) public hasBadge;
    mapping(address => uint256[]) public userBadges;
    mapping(string => uint256) public subsidiaryBadgeCount;

    uint256 public totalBadgesMinted;

    event BadgeMinted(
        address indexed to, uint256 indexed tokenId,
        uint256 badgeType, string subsidiary, string metadata
    );

    constructor() ERC721("Zeni Badge", "ZBADGE") Ownable(msg.sender) {}

    /**
     * @dev Mint badge — moi user chi co 1 cua moi type
     */
    function mintBadge(
        address to,
        uint256 badgeType,
        string calldata subsidiary,
        string calldata metadata
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(!hasBadge[to][badgeType], "Badge already earned");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        badges[tokenId] = Badge({
            badgeType: badgeType,
            mintedAt: block.timestamp,
            subsidiary: subsidiary,
            metadata: metadata
        });

        hasBadge[to][badgeType] = true;
        userBadges[to].push(tokenId);
        subsidiaryBadgeCount[subsidiary]++;
        totalBadgesMinted++;

        emit BadgeMinted(to, tokenId, badgeType, subsidiary, metadata);
        return tokenId;
    }

    /**
     * @dev Batch mint nhieu badges 1 luc (gas efficient)
     */
    function batchMintBadges(
        address[] calldata recipients,
        uint256[] calldata badgeTypes,
        string[] calldata subsidiaries,
        string[] calldata metadatas
    ) external onlyOwner {
        require(
            recipients.length == badgeTypes.length &&
            recipients.length == subsidiaries.length &&
            recipients.length == metadatas.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            if (!hasBadge[recipients[i]][badgeTypes[i]]) {
                uint256 tokenId = _nextTokenId++;
                _safeMint(recipients[i], tokenId);
                badges[tokenId] = Badge(badgeTypes[i], block.timestamp, subsidiaries[i], metadatas[i]);
                hasBadge[recipients[i]][badgeTypes[i]] = true;
                userBadges[recipients[i]].push(tokenId);
                subsidiaryBadgeCount[subsidiaries[i]]++;
                totalBadgesMinted++;
                emit BadgeMinted(recipients[i], tokenId, badgeTypes[i], subsidiaries[i], metadatas[i]);
            }
        }
    }

    // ═══════════════════════════════════════════════
    // VIEW
    // ═══════════════════════════════════════════════

    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    function checkBadge(address user, uint256 badgeType) external view returns (bool) {
        return hasBadge[user][badgeType];
    }

    function getUserBadgeCount(address user) external view returns (uint256) {
        return userBadges[user].length;
    }

    // ═══════════════════════════════════════════════
    // SOUL-BOUND: KHONG cho transfer
    // ═══════════════════════════════════════════════

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soul-bound: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert("Soul-bound: non-transferable");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soul-bound: non-transferable");
    }
}
