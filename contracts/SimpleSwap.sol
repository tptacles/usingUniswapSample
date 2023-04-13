// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "hardhat/console.sol";

error TransferFormFailed();
error AproveFailed();
error NotOwner();
error WithDrawStuckEthFailed();
error WithDrawStuckTokenFailed();
error InvalidInput();

contract SimpleSwap {
    IUniswapV2Router02 private immutable router; //using router 02
    address private immutable owner;
    event transferCompleted(uint256 amountIn, uint256 amountOut);

    constructor() {
        owner = msg.sender;
        router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    }

    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert NotOwner();
        }
        _;
    }

    function swapExactETHForTokens(
        uint256 _amountOutMin,
        address _tokenOut,
        address _to,
        uint256 _allowedTime
    ) external payable {
        if (msg.value <= 0 || _amountOutMin <= 0 || _allowedTime <= 0) {
            revert InvalidInput();
        }
        console.log("contract send value: ", msg.value);
        address[] memory _path = new address[](2);
        _path[0] = router.WETH();
        _path[1] = _tokenOut;
        unchecked {
            uint256[] memory amountOut = router.swapExactETHForTokens{
                value: address(this).balance
            }(_amountOutMin, _path, _to, block.timestamp + _allowedTime);
            console.log("Transfer amount In: ", amountOut[0]);
            console.log(
                "Transfer amount Out: ",
                amountOut[amountOut.length - 1]
            );
            emit transferCompleted(
                amountOut[0],
                amountOut[amountOut.length - 1]
            );
        }
    }

    //needs to approve this contract for token transfer before calling
    function swapExactTokensForTokens(
        address[] calldata _path,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to,
        uint256 _allowedTime
    ) external {
        if (_amountIn <= 0 || _amountOutMin <= 0 || _allowedTime <= 0) {
            revert InvalidInput();
        }
        console.log("Token in: %s msg.sender: %s", _path[0], msg.sender);
        if (
            !IERC20(_path[0]).transferFrom(msg.sender, address(this), _amountIn)
        ) {
            revert TransferFormFailed();
        }
        console.log("AmountIn transferred form: ", _amountIn);

        if (!IERC20(_path[0]).approve(address(router), _amountIn)) {
            revert AproveFailed();
        }
        console.log("Router approved:---- ", _amountIn);
        unchecked {
            uint256[] memory amountOut = router.swapExactTokensForTokens(
                _amountIn,
                _amountOutMin,
                _path,
                _to,
                block.timestamp + _allowedTime
            );
            console.log("Amount Token In: ", amountOut[0]);
            console.log("Amount Token out: ", amountOut[amountOut.length - 1]);
            emit transferCompleted(
                amountOut[0],
                amountOut[amountOut.length - 1]
            );
        }
    }

    function withDrawStuckEth() external onlyOwner {
        (bool _callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!_callSuccess) {
            revert WithDrawStuckEthFailed();
        }
    }

    function withDrawStuckTokens(
        address _token,
        uint256 _amount
    ) external onlyOwner {
        if (_amount <= 0) {
            revert InvalidInput();
        }
        if (!IERC20(_token).transfer(msg.sender, _amount)) {
            revert WithDrawStuckTokenFailed();
        }
    }
}
