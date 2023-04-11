pragma solidity 0.6.6;
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "hardhat/console.sol";

contract PairsSwap {
    function getPair(
        address _factory,
        address _token1,
        address _token2
    ) public pure returns (address pair) {
        pair = UniswapV2Library.pairFor(_factory, _token1, _token2);
    }

    //needs to approve this contract for token transfer before calling
    function swapExactTokensForTokensUsingPairs(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        address _to,
        address _factory
    ) external returns (uint256[] memory amounts) {
        address _pairPool = getPair(_factory, _tokenIn, _tokenOut);
        console.log("PairPool: %s", _pairPool);
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        console.log("path0: %s path1: %s", path[0], path[1]);

        amounts = UniswapV2Library.getAmountsOut(_factory, _amountIn, path);
        console.log(
            "amounts0: %s, amounts1: %s, length: %s",
            amounts[0],
            amounts[1],
            amounts.length
        );
        /*
        //sending the tokens to this contract from wallet must preapprove with ether.js
        require(
            IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn)
        );
        console.log(
            "Contract balance: %s, msg.sender: %s, address(this): %s",
            IERC20(_tokenIn).balanceOf(address(this)),
            msg.sender,
            address(this)
        );
        IERC20(_tokenIn).transfer(_pairPool, _amountIn);
        */

        //directly sending to the pair pool from wallet
        IERC20(_tokenIn).transferFrom(msg.sender, _pairPool, _amountIn);
        console.log(
            "transfer to pairPool success: %s",
            IERC20(_tokenIn).balanceOf(address(this))
        );
        (address token0, ) = UniswapV2Library.sortTokens(_tokenIn, _tokenOut);
        (uint amount0Out, uint amount1Out) = _tokenIn == token0
            ? (uint(0), amounts[1])
            : (amounts[1], uint(0));
        console.log("amount0Out: %s amount1Out: %s", amount0Out, amount1Out);
        IUniswapV2Pair(_pairPool).swap(
            amount0Out,
            amount1Out,
            _to,
            new bytes(0)
        );
        console.log("final balance: %s", IERC20(_tokenOut).balanceOf(_to));
    }
}
