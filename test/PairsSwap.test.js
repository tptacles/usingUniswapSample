const { deployments, network, getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");

if (network.name == "localhost" || network.name == "hardhat") {
  describe("PairsSwap", async function () {
    const fnk_whale = "0xDfFF1c4051B84F08Fd10B7a2C60F70f392b46760";
    const uniswapFactory = process.env.UNISWAP_FACTORY_MAINNET;
    const INPUTTOKEN = process.env.FNK_MAINNET;
    const inputAmount = ethers.utils.parseUnits("1", 18);
    const OUTPUTTOKEN = process.env.USDT_MAINNET;

    let deployer, pairsSwap, impersonatedSigner, inputToken, outputToken;
    beforeEach(async function () {
      await deployments.fixture(["all"]);
      deployer = (await getNamedAccounts()).deployer;
      //impersonate a FNK whale
      const helpers = require("@nomicfoundation/hardhat-network-helpers");
      await helpers.impersonateAccount(fnk_whale);
      impersonatedSigner = await ethers.getSigner(fnk_whale);
      inputToken = await ethers.getContractAt(
        "IERC20",
        INPUTTOKEN,
        impersonatedSigner
      );
      pairsSwap = await ethers.getContract("PairsSwap", impersonatedSigner);
      outputToken = await ethers.getContractAt("IERC20", OUTPUTTOKEN, deployer);
    });
    describe("swapExactTokensForTokensUsingPairs", async function () {
      it("swaps FNK token for USDT", async function () {
        //approve token for transfer to the pair contract by the impersonated account
        const tokenApprove = await inputToken.approve(
          pairsSwap.address,
          inputAmount,
          {
            gasLimit: 500000,
          }
        );
        const beforeBalance = await outputToken.balanceOf(deployer);
        const transactionResponse =
          await pairsSwap.swapExactTokensForTokensUsingPairs(
            INPUTTOKEN,
            OUTPUTTOKEN,
            inputAmount,
            deployer,
            uniswapFactory,
            {
              gasLimit: 500000,
            }
          );
        transactionReciept = await transactionResponse.wait();
        const transactionReceipt = await transactionResponse.wait(1);
        const currentBalance = await outputToken.balanceOf(deployer);
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
