const { ethers } = require("hardhat");
async function main() {
  const { deployer } = await getNamedAccounts();
  console.log("got named accounts: ", deployer);
  const simpleSwap = await ethers.getContract("SimpleSwap", deployer);
  console.log("contract retrieved: ", simpleSwap.address);
  const transactionResponse = await simpleSwap.sendFunds({
    value: ethers.utils.parseEther("1"),
    gasLimit: 50000,
  });
  await transactionResponse.wait(1);
  console.log("transaction response: ", transactionResponse);
  const balance = await simpleSwap.balance();
  console.log("contract balance: ", balance.toString());
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
