const { ethers } = require("hardhat");
async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("got named accounts: ", deployer);
  const simpleSwap = await ethers.getContract("SimpleSwap", deployer);
  console.log("contract retrieved: ", simpleSwap.address);
  const transactionResponse = await simpleSwap.swapExactETHForTokens(
    1,
    process.env.SHIBA_MAINNET,
    deployer,
    10000000,
    {
      value: ethers.utils.parseEther("0.1"),
      gasLimit: 500000,
    }
  );
  await transactionResponse.wait(1);
  console.log("transaction response: ", transactionResponse);
  let amountOut = await simpleSwap.amountOut(0);
  console.log("amount in0: ", amountOut.toString());
  amountOut = await simpleSwap.amountOut(1);
  console.log("amount out1: ", amountOut.toString());
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
