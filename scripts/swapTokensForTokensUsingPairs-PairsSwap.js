const { ethers } = require("hardhat");
const uniswapFactory = process.env.UNISWAP_FACTORY_MAINNET;

const INPUTTOKEN = process.env.FNK_MAINNET;
const inputAmount = ethers.utils.parseUnits("1", 18);
const OUTPUTTOKEN = process.env.USDT_MAINNET;

async function main() {
  const { deployer } = await getNamedAccounts();
  const inputToken = await ethers.getContractAt("IERC20", INPUTTOKEN, deployer);
  const pairsSwap = await ethers.getContract("PairsSwap", deployer);

  const tokenApprove = await inputToken.approve(
    pairsSwap.address,
    inputAmount,
    {
      gasLimit: 500000,
    }
  );
  let transactionReciept = await tokenApprove.wait();
  console.log("shiba approval: ", transactionReciept);
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
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
