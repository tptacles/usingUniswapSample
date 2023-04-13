const { deployments, network, getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");

if (network.name == "localhost" || network.name == "hardhat") {
  describe("SimpleSwap", async function () {
    let deployer;
    let simpleSwap;
    let SHIBA_MAINNET;
    beforeEach(async function () {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;
      simpleSwap = await ethers.getContract("SimpleSwap", deployer);
      SHIBA_MAINNET = process.env.SHIBA_MAINNET;
    });
    describe("swapExactETHForTokens", async function () {
      it("swaps eth for shiba inu token", async function () {
        const outputToken = SHIBA_MAINNET;
        const inputAmount = ethers.utils.parseEther("0.1");
        const TOKEN = await ethers.getContractAt(
          "IERC20",
          outputToken,
          deployer
        );
        const beforeBalance = await TOKEN.balanceOf(deployer);
        const transactionResponse = await simpleSwap.swapExactETHForTokens(
          1,
          outputToken,
          deployer,
          10000000,
          {
            value: inputAmount,
            gasLimit: 500000,
          }
        );
        const transactionReceipt = await transactionResponse.wait();
        const currentBalance = await TOKEN.balanceOf(deployer);
        // console.log(
        //   "amountOut: %s current: %s before: %s",
        //   transactionReceipt.events[
        //     transactionReceipt.events.length - 1
        //   ].args.amountOut.toString(),
        //   currentBalance.toString(),
        //   beforeBalance.toString()
        // );
        // console.log(
        //   "subtracted: ",
        //   currentBalance.sub(beforeBalance).toString()
        // );
        assert.isTrue(
          transactionReceipt.events[
            transactionReceipt.events.length - 1
          ].args.amountOut.eq(currentBalance.sub(beforeBalance))
        );
      });
    });
    describe("swapExactTokensForTokens", async function () {
      it("swaps SHIBA INU token for WETH then EMAX token", async function () {
        //impersonating a shiba whale
        const shiba_whale = "0x46533f26Eb4080e2050e3f8a3014aedf7B5FDb12";
        const helpers = require("@nomicfoundation/hardhat-network-helpers");
        await helpers.impersonateAccount(shiba_whale);
        const impersonatedSigner = await ethers.getSigner(shiba_whale);
        const impersonateSwap = await ethers.getContract(
          "SimpleSwap",
          impersonatedSigner
        );
        const path = [
          process.env.SHIBA_MAINNET,
          process.env.WETH_MAINNET,
          process.env.EMAX_MAINNET,
        ];
        const amountIn = ethers.utils.parseUnits("0.000001", 18);

        let TOKEN = await ethers.getContractAt(
          "IERC20",
          path[0],
          impersonatedSigner
        );

        await TOKEN.approve(impersonateSwap.address, amountIn, {
          gasLimit: 500000,
        });
        //get the balance of the wallet for output token
        TOKEN = await ethers.getContractAt(
          "IERC20",
          path[path.length - 1],
          deployer
        );
        const beforeBalance = await TOKEN.balanceOf(deployer);
        const transactionResponse =
          await impersonateSwap.swapExactTokensForTokens(
            path,
            amountIn,
            1,
            deployer,
            10000000,
            {
              gasLimit: 500000,
            }
          );
        const transactionReceipt = await transactionResponse.wait(1);
        const currentBalance = await TOKEN.balanceOf(deployer);
        assert.isTrue(
          transactionReceipt.events[
            transactionReceipt.events.length - 1
          ].args.amountOut.eq(currentBalance.sub(beforeBalance))
        );
      });
    });
  });
} else {
  describe.skip;
}
