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
    uint256 public balance;
    uint[] public amountOut;

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

    function sendFunds() public payable {
        //(bool success, ) = address(this).call{value: msg.value}("");
        //require(success, "transfer ETH failed");
        balance = address(this).balance;
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
            amountOut = router.swapExactETHForTokens{
                value: address(this).balance
            }(_amountOutMin, _path, _to, block.timestamp + _allowedTime);
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
        //require(IERC20(tokenIn_).transferFrom(msg.sender, address(this), amountIn_), "transferForm Failed");
        //require(IERC20(tokenIn_).approve(address(router), amountIn_), "approve failed");
        if (_amountIn <= 0 || _amountOutMin <= 0 || _allowedTime <= 0) {
            revert InvalidInput();
        }
        if (
            !IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn)
        ) {
            revert TransferFormFailed();
        }
        if (!IERC20(_tokenIn).approve(address(router), _amountIn)) {
            revert AproveFailed();
        }
        address[] memory _path = new address[](2);
        _path[0] = _tokenIn;
        _path[1] = _tokenOut;
        unchecked {
            router.swapExactTokensForTokens(
                _amountIn,
                _amountOutMin,
                _path,
                _to,
                block.timestamp + _allowedTime
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
