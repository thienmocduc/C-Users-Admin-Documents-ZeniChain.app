◇ injected env (3) from .env // tip: ⌘ enable debugging { debug: true }
// Sources flattened with hardhat v3.3.0 https://hardhat.org

// SPDX-License-Identifier: MIT

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


// File npm/@openzeppelin/contracts@5.6.1/utils/introspection/IERC165.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (utils/introspection/IERC165.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC165.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC165.sol)

pragma solidity >=0.4.16;


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC20.sol)

pragma solidity >=0.4.16;


// File npm/@openzeppelin/contracts@5.6.1/interfaces/IERC1363.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/IERC1363.sol)

pragma solidity >=0.6.2;


/**
 * @title IERC1363
 * @dev Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
 *
 * Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
 * after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
 */
interface IERC1363 is IERC20, IERC165 {
    /*
     * Note: the ERC-165 identifier for this interface is 0xb0202a11.
     * 0xb0202a11 ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @param data Additional data with no specified format, sent in call to `spender`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}


// File npm/@openzeppelin/contracts@5.6.1/token/ERC20/utils/SafeERC20.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;


/**
 * @title SafeERC20
 * @dev Wrappers around ERC-20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    /**
     * @dev An operation with an ERC-20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        if (!_safeTransfer(token, to, value, true)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        if (!_safeTransferFrom(token, from, to, value, true)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Variant of {safeTransfer} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransfer(IERC20 token, address to, uint256 value) internal returns (bool) {
        return _safeTransfer(token, to, value, false);
    }

    /**
     * @dev Variant of {safeTransferFrom} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransferFrom(IERC20 token, address from, address to, uint256 value) internal returns (bool) {
        return _safeTransferFrom(token, from, to, value, false);
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     *
     * NOTE: If the token implements ERC-7674, this function will not modify any temporary allowance. This function
     * only sets the "standard" allowance. Any temporary allowance will remain active, in addition to the value being
     * set here.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        if (!_safeApprove(token, spender, value, false)) {
            if (!_safeApprove(token, spender, 0, true)) revert SafeERC20FailedOperation(address(token));
            if (!_safeApprove(token, spender, value, true)) revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that relies on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            safeTransfer(token, to, value);
        } else if (!token.transferAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
     * has no code. This can be used to implement an {ERC721}-like safe transfer that relies on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferFromAndCallRelaxed(
        IERC1363 token,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            safeTransferFrom(token, from, to, value);
        } else if (!token.transferFromAndCall(from, to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
     * Oppositely, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
     * once without retrying, and relies on the returned value to be true.
     *
     * Reverts if the returned value is other than `true`.
     */
    function approveAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            forceApprove(token, to, value);
        } else if (!token.approveAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity `token.transfer(to, value)` call, relaxing the requirement on the return value: the
     * return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param to The recipient of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeTransfer(IERC20 token, address to, uint256 value, bool bubble) private returns (bool success) {
        bytes4 selector = IERC20.transfer.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(to, shr(96, not(0))))
            mstore(0x24, value)
            success := call(gas(), token, 0, 0x00, 0x44, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
        }
    }

    /**
     * @dev Imitates a Solidity `token.transferFrom(from, to, value)` call, relaxing the requirement on the return
     * value: the return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param from The sender of the tokens
     * @param to The recipient of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value,
        bool bubble
    ) private returns (bool success) {
        bytes4 selector = IERC20.transferFrom.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(from, shr(96, not(0))))
            mstore(0x24, and(to, shr(96, not(0))))
            mstore(0x44, value)
            success := call(gas(), token, 0, 0x00, 0x64, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
            mstore(0x60, 0)
        }
    }

    /**
     * @dev Imitates a Solidity `token.approve(spender, value)` call, relaxing the requirement on the return value:
     * the return value is optional (but if data is returned, it must not be false).
     *
     * @param token The token targeted by the call.
     * @param spender The spender of the tokens
     * @param value The amount of token to transfer
     * @param bubble Behavior switch if the transfer call reverts: bubble the revert reason or return a false boolean.
     */
    function _safeApprove(IERC20 token, address spender, uint256 value, bool bubble) private returns (bool success) {
        bytes4 selector = IERC20.approve.selector;

        assembly ("memory-safe") {
            let fmp := mload(0x40)
            mstore(0x00, selector)
            mstore(0x04, and(spender, shr(96, not(0))))
            mstore(0x24, value)
            success := call(gas(), token, 0, 0x00, 0x44, 0x00, 0x20)
            // if call success and return is true, all is good.
            // otherwise (not success or return is not true), we need to perform further checks
            if iszero(and(success, eq(mload(0x00), 1))) {
                // if the call was a failure and bubble is enabled, bubble the error
                if and(iszero(success), bubble) {
                    returndatacopy(fmp, 0x00, returndatasize())
                    revert(fmp, returndatasize())
                }
                // if the return value is not true, then the call is only successful if:
                // - the token address has code
                // - the returndata is empty
                success := and(success, and(iszero(returndatasize()), gt(extcodesize(token), 0)))
            }
            mstore(0x40, fmp)
        }
    }
}


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


// File npm/@openzeppelin/contracts@5.6.1/utils/Pausable.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/StorageSlot.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

pragma solidity ^0.8.20;

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC-1967 implementation slot:
 * ```solidity
 * contract ERC1967 {
 *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(newImplementation.code.length > 0);
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * TIP: Consider using this library along with {SlotDerivation}.
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
     */
    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}


// File npm/@openzeppelin/contracts@5.6.1/utils/ReentrancyGuard.sol

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * IMPORTANT: Deprecated. This storage-based reentrancy guard will be removed and replaced
 * by the {ReentrancyGuardTransient} variant in v6.0.
 *
 * @custom:stateless
 */
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    /**
     * @dev A `view` only version of {nonReentrant}. Use to block view functions
     * from being called, preventing reading from inconsistent contract state.
     *
     * CAUTION: This is a "view" modifier and does not change the reentrancy
     * status. Use it only on view functions. For payable or non-payable functions,
     * use the standard {nonReentrant} modifier instead.
     */
    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        _nonReentrantBeforeView();

        // Any calls to nonReentrant after this point will fail
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}


// File contracts/ZeniTreasury.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.28;




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

