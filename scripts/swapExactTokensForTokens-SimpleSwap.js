const { ethers } = require("hardhat");
const path = [
  process.env.SHIBA_MAINNET,
  process.env.WETH_MAINNET,
  process.env.EMAX_MAINNET,
];
const amountIn = ethers.utils.parseUnits("0.000001", 18);

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("got named accounts: ", deployer);
  const TOKEN = await ethers.getContractAt("IERC20", path[0], deployer);
  //const SHIBA = new ethers.Contract(SHIBA_MAINNET, SHIBA_ABI, provider);
  console.log("IERC20 retrieved: ", await TOKEN.name());

  const simpleSwap = await ethers.getContract("SimpleSwap", deployer);
  console.log("simpleswap retrieved: ", simpleSwap.address);
  await TOKEN.approve(simpleSwap.address, amountIn, {
    gasLimit: 500000,
  });
  console.log("SHIBA tranfer approved-----");
  const transactionResponse = await simpleSwap.swapExactTokensForTokens(
    path,
    amountIn,
    1,
    deployer,
    10000000,
    {
      gasLimit: 500000,
    }
  );
  const transactionReciept = await transactionResponse.wait(1);
  console.log(
    "Amount In: ",
    transactionReciept.events[
      transactionReciept.events.length - 1
    ].args.amountIn.toString()
  );
  console.log(
    "Amount Out: ",
    transactionReciept.events[
      transactionReciept.events.length - 1
    ].args.amountOut.toString()
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
