const { ethers } = require("hardhat");

const outputToken = process.env.FNK_MAINNET; //process.env.SHIBA_MAINNET;
const inputAmount = ethers.utils.parseEther("0.1");

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("got named accounts: ", deployer);
  const simpleSwap = await ethers.getContract("SimpleSwap", deployer);
  console.log("contract retrieved: ", simpleSwap.address);
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
  console.log("transaction response: ", transactionResponse);
  const transactionReceipt = await transactionResponse.wait();
  console.log(
    "the index is :-----",
    transactionReceipt.events.length,
    transactionReceipt.events
  );
  console.log(
    "amount In: ",
    transactionReceipt.events[
      transactionReceipt.events.length - 1
    ].args.amountIn.toString()
  );
  console.log(
    "amount Out: ",
    transactionReceipt.events[
      transactionReceipt.events.length - 1
    ].args.amountOut.toString()
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
