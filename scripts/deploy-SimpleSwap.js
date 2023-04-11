//script to deploy the contract without using hardhat-deploy
const { ethers } = require("hardhat");
async function main() {
  const SimpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
  console.log("Deploying contract...");
  const simpleSwap = await SimpleSwapFactory.deploy();
  await simpleSwap.deployed();
  console.log("SimpleSwap deployed to: ", simpleSwap.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
