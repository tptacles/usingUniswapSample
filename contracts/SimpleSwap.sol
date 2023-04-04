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
            console.log("Transfer amount Out: ", amountOut[1]);
            emit transferCompleted(amountOut[0], amountOut[1]);
        }
    }

    function swapExactTokensForTokens(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to,
        uint256 _allowedTime
    ) external {
        if (_amountIn <= 0 || _amountOutMin <= 0 || _allowedTime <= 0) {
            revert InvalidInput();
        }
        console.log("Token in: ", _tokenIn);
        if (
            !IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn)
        ) {
            revert TransferFormFailed();
        }
        console.log("AmountIn transferred form: ", _amountIn);

        if (!IERC20(_tokenIn).approve(address(router), _amountIn)) {
            revert AproveFailed();
        }
        console.log("Router approved:---- ", _amountIn);
        address[] memory _path = new address[](3);
        _path[0] = _tokenIn;
        _path[1] = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; //WETH address
        _path[2] = _tokenOut;
        unchecked {
            uint256[] memory amountOut = router.swapExactTokensForTokens(
                _amountIn,
                _amountOutMin,
                _path,
                _to,
                block.timestamp + _allowedTime
            );
            console.log("Amount Token In0: ", amountOut[0]);
            console.log("Amount Token Out1: ", amountOut[1]);
            console.log("Amount Token out2: ", amountOut[2]);
            emit transferCompleted(amountOut[0], amountOut[1]);
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
